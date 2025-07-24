<?

namespace Application\Controller;

use Application\Model\ProjectShare;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;

class ProjectShareController extends AbstractActionController
{
    protected $project_share;

    public function __construct(ProjectShare $project_share)
    {
        $this->project_share = $project_share;
    }

    public function indexAction()
    {
        $request = $this->getRequest();

        if ($request->isPost()) {
            return $this->createAction();
        }

        $projectShareId = $this->params()->fromRoute('id');

        if ($projectShareId) {
            $project_share = $this->project_share->fetchByID($projectShareId);

            if (! $project_share) {
                return new JsonModel([
                    'success' => false,
                    'message' => 'No shared user found.'
                ]);
            }

            return new JsonModel([
                'success' => true,
                'project_share' => [
                    'shared_user' => $project_share['shared_user'],
                    'role' => $project_share['role'],
                ],
            ]);
        }
        return $this->notFoundAction();
    }

    // #TODO: Create, edit, delete action
}
