<?php

namespace Application\Service;

use Laminas\View\Renderer\PhpRenderer;
use Laminas\View\Model\ViewModel;
use Mpdf\Mpdf;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;

class PdfExportService
{
    protected $renderer;

    public function __construct(PhpRenderer $renderer)
    {
        $this->renderer = $renderer;
    }

    public function generatePdf(mixed $viewTemplate, mixed $data): string|null
    {
        $defaultConfig = (new ConfigVariables())->getDefaults();
        $fontDirs = $defaultConfig['fontDir'];
        $defaultFontConfig = (new FontVariables())->getDefaults();
        $fontData = $defaultFontConfig['fontdata'];

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'letter',
            'tempDir' => realpath(__DIR__ . '/../../../../tmp'),
            'fontDir' => array_merge($fontDirs, [
                realpath(__DIR__ . '/../../../../public/css/fonts'),
            ]),
            'fontdata' => $fontData + [
                'inter' => [
                    'R' => 'Inter.ttf',
                    'I' => 'Inter-Italic.ttf',
                ],
            ],
            'default_font' => 'customFont',
        ]);

        // Render the view into HTML
        $viewModel = new ViewModel();
        $viewModel->setTemplate($viewTemplate);
        $viewModel->setVariables($data);

        $html = $this->renderer->render($viewModel); // Convert View to HTML
        $mpdf->DefHTMLHeaderByName(
            'CenturaHeader',
            '
            <div style="display: flex; justify-content: space-between;">
        <div style="width: max-content">
            <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M113.755 0.361084H87.4381V5.40201H97.9096V19.524H103.284V5.40201H113.755V0.361084Z" fill="#2D75C3" />
                <path d="M184.922 18.8939C184.843 18.8939 184.803 18.8939 184.724 18.8939C184.685 18.8939 184.764 17.4483 184.764 17.3742C184.764 16.8182 183.183 17.5225 182.867 17.4113C182.946 17.2259 183.223 16.8553 183.104 16.67C182.512 16.1881 181.919 15.7804 181.326 15.2985V15.2615C181.919 15.0391 181.524 14.4831 181.405 13.9271C182.235 14.0754 182.353 14.2978 182.749 13.5194C182.828 13.5194 183.736 14.8537 183.855 14.3348C183.697 13.7418 183.578 13.1117 183.42 12.4815C183.618 12.5557 183.816 12.741 184.092 12.7781C184.132 12.7781 184.132 12.7781 184.171 12.7781C184.487 12.4445 184.645 11.9997 184.882 11.629C185.08 11.9997 185.278 12.4445 185.594 12.7781C185.633 12.7781 185.673 12.7781 185.673 12.7781C185.989 12.741 186.147 12.5557 186.344 12.4815C186.186 13.1117 186.068 13.7047 185.91 14.3348C186.028 14.8537 186.937 13.5194 187.016 13.5194C187.411 14.2978 187.49 14.0383 188.36 13.9271C188.241 14.4831 187.846 15.0391 188.439 15.2615V15.2985C187.846 15.7433 187.253 16.151 186.661 16.67C186.542 16.8553 186.779 17.1889 186.898 17.4113C186.621 17.4854 185.001 16.7812 185.001 17.3742C185.001 17.4483 185.08 18.8939 185.04 18.8939C185.04 18.8939 184.961 18.8939 184.922 18.8939Z" fill="#AAACB0" />
                <path d="M199.582 19.524L187.965 0.361084H181.84L170.222 19.524H176.387L184.883 5.51321L193.378 19.524H199.582Z" fill="#2D75C3" />
                <path d="M82.0643 0.361084C80.6022 0.361084 79.3772 1.47305 79.3772 2.88155V14.5202L66.4953 0.361084H58.4342V19.524H63.8083V5.40201L76.6902 19.524H84.7513V0.361084H82.0643Z" fill="#2D75C3" />
                <path d="M142.759 0.361084H137.385V13.2599C137.385 13.9642 136.793 14.5202 136.042 14.5202H123.16C122.409 14.5202 121.816 13.9642 121.816 13.2599V2.88155C121.816 1.51012 120.631 0.361084 119.129 0.361084H116.442V17.0406C116.442 18.375 117.549 19.4499 118.932 19.524V19.5611H140.072C141.534 19.5611 142.759 18.4491 142.759 17.0406V0.361084Z" fill="#2D75C3" />
                <path d="M53.0601 5.40201C54.5617 5.40201 55.7471 4.29004 55.7471 2.88155V0.361084H32.1171C30.655 0.361084 29.4301 1.47305 29.4301 2.88155V17.0406C29.4301 18.4491 30.6155 19.5611 32.1171 19.5611H55.7471V14.5202H34.8041V11.9997H47.686C49.1481 11.9997 50.3731 10.8877 50.3731 9.47923V7.92247H34.8041V5.43908H53.0601V5.40201Z" fill="#2D75C3" />
                <path d="M7.14347 5.40201H24.0559C25.5575 5.40201 26.743 4.29004 26.743 2.88155V0.361084H3.11293C1.61136 0.361084 0.425903 1.47305 0.425903 2.88155V17.0406C0.425903 18.4491 1.61136 19.5611 3.11293 19.5611H26.743V14.5202H7.14347C6.39268 14.5202 5.79996 13.9642 5.79996 13.2599V6.66224C5.79996 5.958 6.39268 5.40201 7.14347 5.40201Z" fill="#2D75C3" />
                <path d="M171.724 9.96108V5.40201C171.724 2.62209 169.353 0.361084 166.389 0.361084H145.446V19.524H150.82V5.40201H165.046C165.797 5.40201 166.389 5.958 166.389 6.66224V9.18271C166.389 9.88695 165.797 10.4429 165.046 10.4429H153.31V11.9997C153.31 13.3711 154.495 14.5202 155.997 14.5202H166.389V19.5611H171.763V15.002C171.763 13.5935 170.578 12.4815 169.076 12.4815C170.538 12.4445 171.724 11.3325 171.724 9.96108Z" fill="#2D75C3" />
            </svg>
        </div>
    </div>
            '
        );

        $mpdf->DefHTMLFooterByName(
            'CenturaFooter',
            '<div style="text-align: center; font-size: 8px; color: #808080;">
            TORONTO | VANCOUVER | CALGARY | EDMONTON | LONDON | WINDSOR | HAMILTON | PETERBOROUGH | OTTAWA | MONTREAL | QUEBEC CITY | HALIFAX | MONCTON<br>
            Page {PAGENO} of {nbpg}
            </div>'
        );

        $mpdf->WriteHTML($html); // Convert HTML to PDF

        return $mpdf->Output('', 'S'); // Return PDF as a string
    }
}
