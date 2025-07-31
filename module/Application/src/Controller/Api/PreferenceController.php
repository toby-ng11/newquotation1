<?php

namespace Application\Controller\Api;

use Application\Model\UserPreferenceTable;
use Application\Service\UserService;

class PreferenceController extends ApiController
{
    protected $userService;
    protected $userPreferenceTable;

    public function __construct(UserService $userService, UserPreferenceTable $userPreferenceTable)
    {
        $this->userService = $userService;
        $this->userPreferenceTable = $userPreferenceTable;
    }

    public function indexAction()
    {
        /** @var Request $request */
        $request = $this->getRequest();
        $key = $this->params()->fromRoute('key');

        $user = $this->userService->getCurrentUser();
        $userId = $user['id'];

        if ($request->isGet()) {
            $pref = $this->userPreferenceTable->getByUserAndKey($userId, $key);
            return json_encode($pref ? json_decode($pref->value, true) : []);
        }

        if ($request->isPost()) {
            $data = json_decode($request->getContent(), true);
            $value = isset($data['value']) ? $data['value'] : null;

            $this->userPreferenceTable->updateOrCreate($userId, $key, $value);

            return json_encode(['success' => true]);
        }

        return json_encode(['error' => 'Method not allowed']);
    }
}
