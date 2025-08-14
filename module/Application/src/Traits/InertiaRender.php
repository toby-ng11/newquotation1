<?php

namespace Application\Traits;

use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Session\Container;
use Laminas\View\Model\ModelInterface;
use Laminas\View\Model\ViewModel;

/**
 * @method Request getRequest()
 * @method Response getResponse()
 */
trait InertiaRender
{
    /** @var string */
    private $version = null;

    /** @var array */
    private $sharedData = [];

    /**
     * Set version for asset versioning
     */
    public function version(string $version): static
    {
        $this->version = $version;
        return $this;
    }

    /** Flash data for the next request (survives redirects) */
    public function share(array $data): void
    {
        $bag = new Container('inertia');
        $bag->share = $data;
    }

    /** Pull flashed data and clear it so it doesn’t persist further */
    private function getShareData(): array
    {
        $bag = new Container('inertia');
        $data = $bag->share;
        unset($bag->share);
        return $data ?? [];
    }

    /**
     * Render an Inertia response
     */
    public function render(string $component, array $props = []): Response | ViewModel
    {
        $request = $this->getRequest();

        $shareData = $this->getShareData();

        // Merge shared data with props
        $allProps = array_merge($shareData, $props);

        // Check if this is an Inertia request
        if ($this->isInertiaRequest($request)) {
            return $this->createInertiaResponse($component, $allProps);
        }

        // Return initial page load response
        return $this->createInitialResponse($component, $allProps);
    }

    private function isInertiaRequest(Request $request): bool
    {
        return $request->getHeaders()->has('X-Inertia');
    }

    private function createInertiaResponse(string $component, ?array $props): Response
    {
        $uri = $this->getRequest()->getUri()->getPath();

        if ($uri === '/login') {
            $computedProps = $props;
        } else {
            $computedProps = array_merge($this->shared(), $props ?? []);
        }

        $page = [
            'component' => $component,
            'props' => $computedProps,
            'url' => $this->getRequest()->getUri()->getPath(),
            'version' => $this->version,
        ];

        $response = $this->getResponse();
        $response->getHeaders()->addHeaderLine('Content-Type', 'application/json');
        $response->getHeaders()->addHeaderLine('Vary', 'X-Inertia');
        $response->getHeaders()->addHeaderLine('X-Inertia', 'true');
        $response->setStatusCode(200);
        $response->setContent(json_encode($page, JSON_UNESCAPED_UNICODE));
        return $response;
    }

    private function createInitialResponse(string $component, ?array $props): ViewModel
    {
        $uri = $this->getRequest()->getUri()->getPath();

        if ($uri === '/login') {
            $computedProps = $props;
        } else {
            $computedProps = array_merge($this->shared(), $props ?? []);
        }

        $page = [
            'component' => $component,
            'props' => $computedProps,
            'url' => $this->getRequest()->getUri()->getPath(),
            'version' => $this->version,
        ];

        /** @var ModelInterface $model */
        $model = $this->layout();
        $model->setVariable('page', $page);

        $view = new ViewModel([]);
        $view->setTemplate('application/inertia/app');
        return $view;
    }

    /**
     * Define globally shared props for Inertia responses.
     *
     * @return array
     */
    public function shared(): array
    {
        $userService = $this->getUserService();
        $user = $userService->getCurrentUser();

        $request = $this->getRequest();
        $cookies = $request->getCookie();

        $sidebarOpen = true;

        if ($cookies instanceof \Laminas\Http\Header\Cookie) {
            $sidebarOpen = ! $cookies->offsetExists('sidebar_state')
                || $cookies->offsetGet('sidebar_state') === 'true';
        }

        return [
            'user' => $user,
            'sidebarOpen' => $sidebarOpen,
            // Add more shared data here as needed
        ];
    }
}
