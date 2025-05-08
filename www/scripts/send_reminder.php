<?php

ini_set('output_buffering', 'off');
ini_set('implicit_flush', 1);
ob_implicit_flush(true);

use Application\Service\MailerService;
use Application\Model\Note;
use Application\Model\Project;

// Include your Laminas app bootstrap (update as needed)
chdir(dirname(__DIR__));
include __DIR__ . '/../vendor/autoload.php';

$appConfig = require __DIR__ . '/../config/application.config.php';
$app = Laminas\Mvc\Application::init($appConfig);

$serviceManager = $app->getServiceManager();
$config = $serviceManager->get('config');
$siteUrl = $config['site']['url'] ?? 'https://localhost';

/** @var \Application\Model\Note $noteTable */
$noteTable = $serviceManager->get(Note::class);
/** @var \Application\Model\Project $project */
$projectTable = $serviceManager->get(Project::class);
/** @var \Application\Service\MailerSerive $mailer */
$mailer = $serviceManager->get(MailerService::class);

echo "✅ Reminder worker started. Press Ctrl+C to stop.\n";
while (true) {
    try {
        $notes = $noteTable->fetchPendingFollowUps();

        foreach ($notes as $note) {
            $email = $note['owner_id'] . '@centura.ca';
            $project = $projectTable->fetchById($note['project_id']);
            $subject = "Follow-Up Reminder: " . $note['next_action'] . " for project: " . $project['project_name'];
            $message = $note['next_action'] ?: $note['project_note'];

            $projectLink = rtrim($siteUrl, '/') . '/project/' . $note['project_id'] . '/edit';
            $mailer->sendReminderEmail($note, $note['owner_id'] . '@centura.ca', $subject, $projectLink);
            $noteTable->markReminderSent($note['project_note_id']);

            echo "[SENT] $email @ " . date('Y-m-d H:i:s') . PHP_EOL;
        }

        sleep(30); // Wait 20sec before checking again
    } catch (\Throwable $e) {
        echo "[ERROR] " . $e->getMessage() . "\n";
        sleep(30); // Still wait before retrying
    }
}
