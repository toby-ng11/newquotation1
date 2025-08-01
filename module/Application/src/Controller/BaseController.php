<?php

namespace Application\Controller;

use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\Controller\AbstractRestfulController;
use Laminas\View\Model\ViewModel;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @method Request getRequest()
 * @method Response getResponse()
 */
abstract class BaseController extends AbstractRestfulController
{
    /**
     * Render 404 page
     *
     * @return void
     */
    protected function abort403()
    {
        return (new ViewModel())->setTemplate('error/permission');
    }

    /**
     * Render 403 page
     *
     * @return void
     */
    protected function abort404()
    {
        return (new ViewModel())->setTemplate('error/not-found');
    }

    protected function json($data, int $status = 200, array $headers = []): Response
    {
        $symfony = new JsonResponse($data, $status, $headers);

        $response = $this->getResponse();
        $response->setContent($symfony->getContent());
        foreach ($symfony->headers->allPreserveCase() as $name => $values) {
            foreach ($values as $value) {
                $response->getHeaders()->addHeaderLine($name, $value);
            }
        }
        $response->setStatusCode($symfony->getStatusCode());

        return $response;
    }
}
