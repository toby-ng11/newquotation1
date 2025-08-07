<?php

declare(strict_types=1);

namespace Application\Controller;

use Application\Traits\HasModels;
use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\Controller\AbstractRestfulController;
use Laminas\View\Model\ModelInterface;
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

    /**
     * Returns a JSON HTTP response using Symfony's JsonResponse.
     *
     * Replaces the deprecated Laminas\View\Model\JsonModel by manually writing the JSON content and headers
     * into the Laminas HTTP response object.
     *
     * @param mixed $data The data to be JSON-encoded (array, object, etc.).
     * @param int $status The HTTP status code to return (default: 200).
     * @param array $headers Optional headers to add to the response.
     * @return \Laminas\Http\Response A Laminas response with JSON content and proper headers.
     */
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

    /**
     * Render an Inertia page by injecting the component and props into the layout.
     *
     * This method sets the `page` variable on the layout, which is consumed by the frontend
     * Inertia React app to determine which component to render and with what props.
     *
     * @param string $component The name of the Inertia component to render (e.g. 'auth/login').
     * @param array|null $props Optional props to pass to the component (default: empty array).
     * @param string|null $url Optional URL override. If not set, the current request URI will be used.
     * @return ViewModel A ViewModel that uses the Inertia layout and passes Inertia page data.
     */
    protected function inertia(string $component, ?array $props = [], ?string $url = null): ViewModel
    {
        /** @var ModelInterface $model */
        $model = $this->layout();
        $model->setVariable('page', [
            'component' => $component,
            'props' => $props,
            'url' => $url ?? $this->getRequest()->getUriString(),
            'version' => null,
        ]);

        $view = new ViewModel([]);
        $view->setTemplate('application/inertia/app');
        return $view;
    }
}
