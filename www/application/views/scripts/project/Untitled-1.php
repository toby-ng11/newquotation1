<?php

if (isset($pdf)) {
    //header and footer
    $obj = $pdf->open_object();

    $w = $pdf->get_width();
    $h = $pdf->get_height();
    $font = $fontMetrics->getFont("helvetica", "bold");
    $size = 8;
    $y1 = $pdf->get_height() - 36;
    $x = 15;
    $pageText1 = 'TORONTO | VANCOUVER | CALGARY | EDMONTON | LONDON | WINDSOR | HAMILTON | PETERBOROUGH';
    $w1 = $fontMetrics->get_text_width($pageText1, $font, $size);
    $pdf->page_text(($w - $w1) / 2, $y1, $pageText1, $font,  $size);

    $y2 = $pdf->get_height() - 24;
    $pageText2 = 'OTTWA | MONTREAL | QUEBEC CITY | HALIFAX | MONCTON';
    $w2 = $fontMetrics->get_text_width($pageText2, $font, $size);
    $pdf->page_text(($w - $w2) / 2, $y2, $pageText2, $font,  $size);
    $pdf->page_text($w - 48, $y2, "{PAGE_NUM} of {PAGE_COUNT}", $font, $size, array(0, 0, 0));

    // Add a logo
    $image = 'http://newstatic.centura.local' . '/images/printlogo.png';
    $img_w = 54; // 2 inches, in points
    $img_h = 9; // 1 inch, in points -- change these as required
    $pdf->image($image, "png", null, null, $img_w, $img_h);

    // add text top 1
    $top1_y = 4;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = '950 LAWRENCE AVENUE WEST';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);

    // add text top 2
    $top1_y = 12;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'TORONTO, ONTARIO, CANADA M6A 1C4';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);

    // add text top 2
    $top1_y = 20;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'ORDER DESK: 416-785-5151';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);


    // add text 
    $top1_y = 28;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'OFFICE: 416-785-5165';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);


    // add text 
    $top1_y = 36;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'WATTS: 1-800-263-9400';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);

    // add text 
    $top1_y = 44;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'FAX: 416-783-0636';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);

    // add text 
    $top1_y = 52;
    $top_size = 6;
    $top_font = $fontMetrics->getFont("helvetica", "normal");
    $top_text1 = 'www.centura.ca';
    $top_text1_width = $fontMetrics->get_text_width($top_text1, $top_font, $top_size);
    $pdf->page_text($w - $top_text1_width -  4, $top1_y, $top_text1, $top_font,  $top_size);



    // Close the object (stop capture)
    $pdf->close_object();
    $pdf->add_object($obj, 'all');
}
