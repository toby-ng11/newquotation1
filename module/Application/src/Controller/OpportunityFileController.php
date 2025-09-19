<?php

namespace Application\Controller;

use Laminas\Db\Sql\Expression;
use Laminas\Http\Response;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;

class OpportunityFileController extends BaseController
{
    public function __construct(ContainerInterface $container)
    {
        parent::__construct($container);
    }

    // GET /enpoint
    public function getList()
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $opportunityId = $this->params()->fromQuery('opp', null);

        if ($opportunityId) {
            $data = $this->getOpportunityFileModel()->where(['opportunity_id' => $opportunityId]);
            return $this->json($data);
        }

        return $this->json([
            'success' => true,
            'data' => $this->getOpportunityFileModel()->all(),
        ]);
    }

    // GET /enpoint/:id
    public function get(mixed $id)
    {
        $request = $this->getRequest();
        if (!$this->expectsJson($request)) {
            return $this->abort404();
        }

        $row = $this->getOpportunityFileModel()->find($id);
        return $this->json([
            'success' => true,
            'opportinity' => $row,
        ]);
    }

    // POST /enpoint
    public function create(mixed $data)
    {
        $oppId = (int) $this->params()->fromQuery('opp', 0);
        $request = $this->getRequest();
        $files = $request->getFiles()->toArray();

        if ($oppId && isset($files['upload']) && $files['upload']['error'] === UPLOAD_ERR_OK) {
            $tmpPath = $files['upload']['tmp_name'];
            $origName = $files['upload']['name'];
            $mime     = mime_content_type($tmpPath);
            $size     = $files['upload']['size'];

            // Sanitize + generate unique name
            $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
            $fileName = uniqid('file_', true) . '.' . $ext;

            $targetDir = realpath(__DIR__ . '/../../../../data/uploads/opportunity/' . $oppId);
            if ($targetDir === false) {
                $targetDir = __DIR__ . '/../../../../data/uploads/opportunity/' . $oppId;
                mkdir($targetDir, 0775, true);
            }

            $targetPath = $targetDir . '/' . $fileName;
            move_uploaded_file($tmpPath, $targetPath);

            $id = $this->getOpportunityFileModel()->create([
                'opportunity_id'  =>  $oppId,
                'file_name'     => $fileName,
                'original_name' => $origName,
                'mime_type'     => $mime,
                'file_size'     => $size,
                'uploaded_by'   => $this->getUserService()->getCurrentUser()['id'] ?? 0,
                'created_at'     => new Expression('GETDATE()'),
            ]);

            return $this->json(['success' => true, 'id' => $id]);
        }

        return $this->json(['success' => false, 'error' => 'No file uploaded']);
    }

    // PUT /enpoint/:id
    public function update(mixed $id, mixed $data)
    {
        $result = $this->getOpportunityFileModel()->update($id, $data);
        return $this->json([
            'success' => $result !== false,
            'message' => $result !== false ? 'Saved successfully!' : 'Error! Please check log for more details.',
        ]);
    }

    // DELETE /enpoint/:id
    public function delete(mixed $id)
    {
        if (! $id) {
            return $this->json(['success' => false, 'message' => 'Invalid file id']);
        }

        try {
            // Fetch file record first
            $file = $this->getOpportunityFileModel()->find($id);

            // Build full path
            $filePath = __DIR__ . '/../../../../data/uploads/opportunity/' . $file['opportunity_id'] . '/' . $file['file_name'];

            // Delete DB record
            $deleted = $this->getOpportunityFileModel()->delete($id);

            if ($deleted) {
                if (file_exists($filePath)) {
                    unlink($filePath); // remove from disk
                }
                return $this->json(['success' => true, 'message' => 'File deleted']);
            }

            return $this->json(['success' => false, 'message' => 'Delete failed']);
        } catch (\Exception $e) {
            return $this->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    // GET /opportunity-files/{id}/download
    public function downloadAction(): Response | ViewModel
    {
        $id   = (int) $this->params()->fromRoute('id');
        $file = $this->getOpportunityFileModel()->find($id);

        $filePath = __DIR__ . '/../../../../data/uploads/opportunity/' . $file['opportunity_id'] . '/' . $file['file_name'];

        if (!file_exists($filePath)) {
            return $this->abort404();
        }

        $response = new Response();
        $response->getHeaders()
            ->addHeaderLine('Content-Type', $file['mime_type'])
            ->addHeaderLine(
                'Content-Disposition',
                'attachment; filename="' . $file['original_name'] . '"'
            )
            ->addHeaderLine('Content-Length', (string) filesize($filePath));

        $response->setContent(file_get_contents($filePath));
        return $response;
    }
}
