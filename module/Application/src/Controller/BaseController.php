<?php

declare(strict_types=1);

namespace Application\Controller;

use Application\Traits\HasModels;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\Controller\AbstractRestfulController;
use Laminas\View\Model\ViewModel;
use Psr\Container\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * @method Request getRequest()
 * @method Response getResponse()
 *
 * @property \Laminas\Mvc\Controller\PluginManager $plugins
 * @property \Laminas\Http\Request $request
 * @property \Laminas\Http\Response $response
 * @property \Laminas\Mvc\MvcEvent $event
 * @property \Laminas\EventManager\EventManagerInterface $events
 */
abstract class BaseController extends AbstractRestfulController
{
    use HasModels;

    /**
     * Render 403 page
     *
     * @return ViewModel
     */
    protected function abort403(): ViewModel
    {
        $this->layout()->setTemplate('error/permission');
        $view = new ViewModel();
        return $view;
    }

    /**
     * Render 404 page
     *
     * @return ViewModel
     */
    protected function abort404()
    {
        $this->layout()->setTemplate('error/not-found');
        $view = new ViewModel();
        return $view;
    }

    /** @var ContainerInterface|null $container */
    protected $container;

    public function __construct(?ContainerInterface $container)
    {
        $this->container = $container;
    }

    protected function json(mixed $data, int $status = 200, array $headers = []): Response
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
