<?php

namespace Application\Service;

use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

use Twig\Environment as Twig;

class MailerService
{
    private $mailer;
    private $from;
    private $twig;

    public function __construct($dsn, $from, Twig $twig)
    {
        $transport = Transport::fromDsn($dsn);
        $this->mailer = new Mailer($transport);
        $this->from = $from;
        $this->twig = $twig;
    }

    public function sendReminderEmail(array $note, string $to, string $subject, string $projectLink)
    {
        $html = $this->twig->render('note-reminder.html.twig', [
            'note_title'   => $note['note_title'],
            'project_note' => $note['project_note'],
            'next_action'  => $note['next_action'] ?? '',
            'project_link' => $projectLink,
            'now'          => new \DateTime(),
        ]);

        $email = (new Email())
            ->from($this->from)
            ->to($to)
            ->subject($subject)
            ->text(strip_tags($html))
            ->html($html);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $e) {
            // Log or rethrow
            error_log("Email error: " . $e->getMessage());
            return false;
        }

        return true;
    }
}
