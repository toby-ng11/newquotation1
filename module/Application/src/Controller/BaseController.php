<?php

declare(strict_types=1);

namespace Application\Controller;

use Laminas\Http\Request;
use Laminas\Http\Response;
use Laminas\Mvc\Controller\AbstractRestfulController;
use Laminas\View\Model\ViewModel;

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
}
