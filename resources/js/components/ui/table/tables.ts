import type { AjaxSettings } from 'datatables.net-dt';
import DataTable, { Api } from 'datatables.net-dt';
import 'datatables.net-fixedcolumns-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-select-dt';

import { architectID, projectID, sheetType } from '@/components/init';

let projectNoteTable: Api<any>;
let itemTable: Api<any>;
let architectProjectsTable: Api<any>;
let architectAddressesTable: Api<any>;
let architectSpecifiersTable: Api<any>;

const tableConfigs: Record<string, (el: HTMLElement) => Api<any>> = {
    /* ------ ADMIN PORTAL ------ */
    adminProject: (el) => {
        return new DataTable(el, {
            ajax: {
                url: '/index/admin/project?view=true',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // experimetal: server-side processing
            columns: [
                {
                    data: 'project_id',
                    render: function (data) {
                        return '<a href="/project/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_id_ext',
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'owner_id',
                },
                {
                    data: 'shared_id',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'due_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'status_desc',
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        let info = document.createElement('div');
                    info.innerHTML = '<i data-lucide="ellipsis" class="w-4 h-4"></i>';
                    return info;
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 1, 3, 4, 5, 6, 8, 9],
                    className: 'dt-body-center',
                },
            ],
            //"responsive": true,
            order: [[0, 'desc']],
            fixedColumns: {
                start: 1,
                end: 1,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">All projects</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    adminQuote: (el) => {
        return new DataTable('#admin-quote-table', {
            ajax: {
                url: '/index/admin/quote?view=true',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // to-do: server-side processing with laminas
            columns: [
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'expire_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'ship_required_date.date',
                    render: function (data) {
                        if (!data) {
                            return '<p>--</p>';
                        }
                        let date = new Date(data);
                        return '<p>' + date.toLocaleDateString('en-CA') + '</p>';
                    },
                },
                {
                    data: 'project_status',
                },
                {
                    data: 'quote_status_id',
                    render: function (data) {
                        if (data == 4) {
                            return '<span class="disapproved red">Disapproved</span>';
                        } else if (data == 3) {
                            return '<span class="approved green">Approved</span>';
                        } else if (data == 2) {
                            return '<span class="waiting orange">Waiting</span>';
                        } else {
                            return 'Not submitted';
                        }
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 4, 5, 6, 7],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            fixedColumns: {
                start: 1,
                end: 1,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">All quotes</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    /* ------ HOME PORTAL ------ */
    homeOwnProject: () => {
        return new DataTable('#dashboard-home-own-table', {
            //select: true,
            ajax: {
                url: '/index/home/own?view=true',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            //responsive: true,
            columns: [
                {
                    data: 'project_id_ext',
                    render: function (data, type, row) {
                        return (
                            '<a href="/project/' +
                            row.project_id +
                            '/edit" class="text-blue-500 dark:text-blue-300" title="Edit project ' +
                            row.project_id +
                            '">' +
                            data +
                            '</a>'
                        );
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'shared_id',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'quote_count',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'due_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'status_desc',
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        return (
                            "<a   href='/project/" +
                            data +
                            "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
                        );
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 5, 6, 7, 8],
                    className: 'dt-body-center',
                },
            ],
            order: {
                name: 'project_id',
                dir: 'desc',
            },
            fixedColumns: {
                start: 1,
                end: 2,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">My Projects</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    homeSharedProject: () => {
        return new DataTable('#dashboard-home-assigned-table', {
            //select: true,
            ajax: {
                url: '/index/home/assigned',
                dataSrc: '',
            } as AjaxSettings,
            //responsive: true,
            columns: [
                {
                    data: 'project_id_ext',
                    render: function (data, type, row) {
                        {
                            return '<a href="/project/' + row.project_id + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                        }
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'owner_id',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'quote_count',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'due_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'status_desc',
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        return (
                            "<a href='/project/" +
                            data +
                            "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
                        );
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 5, 6, 7, 8],
                    className: 'dt-body-center',
                },
            ],
            processing: true,
            order: {
                name: 'project_id',
                dir: 'desc',
            },
            fixedColumns: {
                start: 1,
                end: 2,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Shared Projects</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    homeOtherProject: () => {
        return new DataTable('#dashboard-home-other-table', {
            ajax: {
                url: '/index/home/other',
                dataSrc: '',
            } as AjaxSettings,
            //responsive: true,
            columns: [
                {
                    data: 'project_id_ext',
                    render: function (data, type, row) {
                        return '<a href="/project/' + row.project_id + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'owner_id',
                },
                {
                    data: 'shared_id',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'quote_count',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'due_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'status_desc',
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        return (
                            "<a   href='/project/" +
                            data +
                            "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
                        );
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 4, 6, 7, 8],
                    className: 'dt-body-center',
                },
            ],
            processing: true,
            order: {
                name: 'project_id',
                dir: 'desc',
            },
            fixedColumns: {
                start: 1,
                end: 2,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Other user projects</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    homeQuote: () => {
        return new DataTable('#dashboard-home-quote-table', {
            ajax: {
                url: '/index/home/quote',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //"serverSide": true,
            columns: [
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        return '<a href="/project/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'expire_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'ship_required_date.date',
                    render: function (data) {
                        if (!data) {
                            return '<p>--</p>';
                        }
                        let date = new Date(data);
                        return '<p>' + date.toLocaleDateString('en-CA') + '</p>';
                    },
                },
                {
                    data: 'customer_name',
                },
                {
                    data: 'project_status',
                },
                {
                    data: 'quote_status_id',
                    render: function (data) {
                        if (data == 4) {
                            return '<span class="disapproved red">Disapproved</span>';
                        } else if (data == 3) {
                            return '<span class="approved green">Approved</span>';
                        } else if (data == 2) {
                            return '<span class="waiting orange">Waiting</span>';
                        } else {
                            return 'Not submitted';
                        }
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 1, 3, 4, 5, 7, 8],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            fixedColumns: {
                start: 2,
                end: 2,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">My Quotes</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    homeNote: () => {
        return new DataTable('#dashboard-home-note-table', {
            ajax: {
                url: '/index/home/note',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            columns: [
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return '<p><b>' + date.toLocaleDateString('en-CA') + '</b></p>';
                    },
                },
                {
                    data: 'project_id',
                    render: function (data, type, row) {
                        {
                            return (
                                '<a href="/project/' + row.project_id + '/edit" class="text-blue-500 dark:text-blue-300">' + row.project_id + '</a>'
                            );
                        }
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'next_action',
                    render: function (data) {
                        let formattedText = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
                        return '<p>' + formattedText + '</p>';
                    },
                },
            ],
            columnDefs: [
                {
                    targets: [0, 1, 2, 3],
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 1],
                    className: 'dt-body-center',
                },
            ],
            fixedColumns: {
                //start: 3
            },
            scrollX: true,
            order: [[0, 'desc']],
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Follow Up Notes</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    /* ------ APPROVAL PORTAL ------ */
    approvalWaiting: () => {
        return new DataTable('#dashboard-approve-waiting-table', {
            ajax: {
                url: '/index/approval/waiting',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true,
            columns: [
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'architect_rep_id',
                },
                {
                    data: 'customer_name',
                },
                {
                    data: 'owner_name',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'ship_required_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'quote_status',
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 4, 5, 6, 7, 8],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            fixedColumns: {
                start: 1,
                end: 1,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Waiting for Approval</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    approvalApproved: () => {
        return new DataTable('#dashboard-approve-approved-table', {
            ajax: {
                url: '/index/approval/approved',
                dataSrc: '',
            } as AjaxSettings,
            //responsive: true,
            processing: true,
            //serverSide: true,
            columns: [
                {
                    data: 'quote_id',
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="row-checkbox" value="${data}">`;
                    },
                },
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'customer_name',
                },
                {
                    data: 'owner_name',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'expire_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'ship_required_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'quote_status',
                },
                {
                    data: 'order_no',
                },
            ],
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    className: 'dt-body-center',
                    render: function (data, type, row, meta) {
                        if (type === 'display' && meta.row === 0) {
                            // Render a blank cell for data rows; header will be handled separately
                            return `<input type="checkbox" class="row-checkbox" value="${row.project_id}">`;
                        }
                        return `<input type="checkbox" class="row-checkbox" value="${row.project_id}">`;
                    },
                },
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [1, 5, 6, 7, 8, 9, 10, 11],
                    className: 'dt-body-center',
                },
            ],
            order: [[1, 'desc']],
            fixedColumns: {
                start: 2,
                end: 1,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Approved</p>';
                    return info;
                },
                topEnd: [
                    {
                        div: {
                            className: 'layout-end',
                            html: `
                                <button id="export-selected" class="button action has-icon export-item-button small">
                                    <span class="button-wrap text-[10px] font-bold">
                                        <span class="icon icon-export"></span>
                                            Export Selected
                                        </span>
                                    </button>
                                `,
                        },
                    },
                    'search',
                ],
                bottomStart: 'pageLength',
            },
        });
    },
    approvalDisapproved: () => {
        return new DataTable('#dashboard-approve-disapproved-table', {
            ajax: {
                url: '/index/approval/disapproved',
                dataSrc: '',
            } as AjaxSettings,
            responsive: true,
            processing: true,
            //serverSide: true,
            columns: [
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'customer_name',
                },
                {
                    data: 'owner_name',
                },
                {
                    data: 'market_segment_desc',
                },
                {
                    data: 'created_at',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'expire_date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'ship_required_date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'quote_status',
                },
                {
                    data: 'quote_id',
                    render: function (data, type, row) {
                        return (
                            "<a   href='/quote/edit/id/" +
                            row.quote_id +
                            "'><span class='button-wrap'><span class='icon icon-edit'></span></span></a>"
                        );
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 4, 5, 6, 7, 8, 9, 10],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            fixedColumns: {
                start: 1,
                end: 1,
            },
            scrollX: true,
            layout: {
                topStart: function () {
                    let info = document.createElement('div');
                    info.innerHTML = '<p class="leading-none font-semibold text-lg">Disapproved</p>';
                    return info;
                },
                bottomStart: 'pageLength',
            },
        });
    },
    /* ------ ARCHITECT PORTAL ------ */
    architectAll: () => {
        return new DataTable('#architect-all-table', {
            ajax: {
                url: '/index/architect/all',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // experimetal: server-side processing
            columns: [
                {
                    data: 'architect_id',
                    render: function (data, type, row) {
                        return '<a href="/architect/' + row.architect_id + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'architect_name',
                },
                {
                    data: 'architect_rep_id',
                },
                {
                    data: 'architect_type_desc',
                },
                {
                    data: 'class_id',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'project_count',
                },
                {
                    data: 'quote_count',
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 4, 5, 6, 7],
                    className: 'dt-body-center',
                },
            ],
            //"responsive": true,
            order: [[0, 'desc']],
            fixedColumns: {
                start: 1,
                end: 2,
            },
            scrollX: true,
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: 'search',
            },
        });
    },
    architectTop5: () => {
        return new DataTable('#top-5-architect-table', {
            ajax: {
                url: '/index/architect/topfive',
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // experimetal: server-side processing
            columns: [
                {
                    data: 'architect_name',
                    render: function (data, type, row) {
                        return (
                            '<a href="/architect/' +
                            row.architect_id +
                            `/edit" class="text-blue-500 dark:text-blue-300 after:content-['_↗']">` +
                            data +
                            '</a>'
                        );
                    },
                },
                {
                    data: 'total_projects',
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0],
                    className: 'dt-body-center',
                },
            ],
            //"responsive": true,
            order: {
                name: 'total_projects',
                dir: 'desc',
            },
            scrollX: true,
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: null,
                bottomEnd: null,
            },
        });
    },
    /* ------ PROJECT + QUOTE EDIT ------ */
    projectNote: () => {
        return (projectNoteTable = new DataTable('#note-table', {
            ajax: {
                url: `/project/${projectID}/note`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            columns: [
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return '<p><b>' + date.toLocaleDateString('en-CA') + '</b></p>';
                    },
                },
                {
                    data: 'note_title',
                    render: function (data, type, row) {
                        function formatTextWithLinks(text: string) {
                            if (!text) return '';
                            let formatted = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
                            return formatted.replace(
                                /(https:\/\/[^\s<]+)/g,
                                '<a href="$1" target="_blank" class="text-blue-500 visited:text-blue-500 underline">$1</a>',
                            );
                        }
                        if (data == '') {
                            return '<p>' + formatTextWithLinks(row.project_note) + '</p>';
                        } else if (row.project_note == null) {
                            // this is for old quote system rendering
                            return '<p>' + data + '</p>';
                        } else {
                            return '<p><b>' + data + '</b></br>' + formatTextWithLinks(row.project_note) + '</p>';
                        }
                    },
                },
                {
                    data: 'next_action',
                    render: function (data) {
                        let formattedText = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
                        return '<p>' + formattedText + '</p>';
                    },
                },
                {
                    data: 'follow_up_date.date',
                    render: function (data, type, row) {
                        const isSent = row.notified_flag === 'Y';
                        if (!data) {
                            return '--';
                        }
                        let date = new Date(data).toLocaleString('en-CA');
                        if (isSent) {
                            return `<span title="Reminder already sent">${date} <span class="tag tag-sent">Sent</span></span>`;
                        }
                        return date;
                    },
                },
                {
                    data: 'owner_id',
                    render: function (data) {
                        if (data != null) {
                            return '<p><b>' + data + '</b></p>';
                        } else {
                            return data;
                        }
                    },
                },
                {
                    data: 'project_note_id',
                    render: function (data, type, row) {
                        if (!window.isOwner) return null;

                        const isSent = row.notified_flag === 'Y';
                        const buttons = [];

                        if (!isSent) {
                            buttons.push(`
                <a href="#" title="Edit this note" class="note-edit" data-id="${data}">
                  <span class="button-wrap">
                    <span class="icon icon-edit"></span>
                  </span>
                </a>
              `);
                        }

                        // Always show delete
                        buttons.push(`
              <a href="#" title="Delete this note" class="note-delete" data-id="${data}">
                <span class="button-wrap">
                  <span class="icon icon-delete"></span>
                </span>
              </a>
            `);

                        return `<div class="row-button">${buttons.join('')}</div>`;
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 3, 4, 5],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            scrollX: true,
            fixedColumns: {
                end: 1,
            },
        }));
    },
    item: () => {
        return (itemTable = new DataTable('#item-table', {
            ajax: {
                url: `/${sheetType}/${projectID}/items`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            //responsive: true,
            columns: [
                {
                    data: 'item_id',
                    render: function (data, type, row) {
                        return '<b class="item-name">' + data + '</b>' + '<br>' + row.item_desc;
                    },
                },
                {
                    data: 'quantity',
                    render: function (data) {
                        let qty = Number.parseFloat(data).toFixed(0);
                        return '<b>' + qty + '</b>';
                    },
                },
                {
                    data: 'unit_price',
                    render: function (data) {
                        return '<b>' + data + '</b>';
                    },
                },
                {
                    data: 'uom',
                    render: function (data) {
                        return '<b>' + data + '</b>';
                    },
                },
                {
                    data: 'subtotal',
                    render: function (data) {
                        return '<b>' + data + '</b>';
                    },
                },
                {
                    data: 'note',
                    render: function (data) {
                        let formattedText = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
                        return '<p>' + formattedText + '</p>';
                    },
                },
                {
                    data: 'item_uid',
                    render: function (data) {
                        const buttons = [];
                        buttons.push(`
                            <a href="#" title="Edit this item" class="item-edit" data-id="${data}">
                                <span class="button-wrap">
                                    <span class="icon icon-edit"></span>
                                </span>
                            </a>
                        `);

                        buttons.push(`
                            <a href="#" title="Delete this item" class="item-delete" data-id="${data}">
                                <span class="button-wrap">
                                    <span class="icon icon-delete"></span>
                                </span>
                            </a>
                        `);

                        return `<div class="row-button">${buttons.join('')}</div>`;
                        return (
                            '<div class="row-button">' +
                            '<a title="Edit this item" class="item-edit" href="/item/fetch?uid=' +
                            data +
                            '&type=' +
                            sheetType +
                            '">' +
                            '<span class="button-wrap">' +
                            '<span class="icon icon-edit"></span>' +
                            '</span></a>' +
                            '<a title="Delete this item" class="item-delete" href="/item/delete?uid=' +
                            data +
                            '&type=' +
                            sheetType +
                            '">' +
                            '<span class="button-wrap">' +
                            '<span class="icon icon-delete"></span>' +
                            '</span></a></div>'
                        );
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 1, 2, 3, 4],
                    className: 'dt-body-center',
                },
            ],
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: null,
                bottomEnd: 'info',
            },
            order: [[7, 'desc']], // sort by item uid, newest item on top
            paging: false,
            scrollX: true,
            fixedColumns: {
                start: 1,
                end: 1,
            },
            //rowReorder: true
        }));
    },
    projectQuote: () => {
        return new DataTable('#project-quote-table', {
            ajax: {
                url: `/project/${projectID}/quotetable`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            columns: [
                {
                    data: 'quote_id',
                    render: function (data) {
                        return '<a href="/quote/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'customer_name',
                },
                {
                    data: 'contact_full_name',
                },
                {
                    data: 'created_at.date',
                    render: function (data) {
                        let date = new Date(data);
                        return date.toLocaleDateString();
                    },
                },
                {
                    data: 'expire_date.date',
                    render: function (data) {
                        let date = new Date(data);
                        let today = new Date();
                        if (date <= today) {
                            return '<span class="red">' + date.toLocaleDateString() + '</span>';
                        } else {
                            return date.toLocaleDateString();
                        }
                    },
                },
                {
                    data: 'ship_required_date.date',
                    render: function (data) {
                        if (!data) {
                            return '<p>--</p>';
                        }
                        let date = new Date(data);
                        return '<p>' + date.toLocaleDateString('en-CA') + '</p>';
                    },
                },
                {
                    data: 'quote_status',
                    render: function (data) {
                        if (data == 'Dissapproved') {
                            return '<span class="disapproved red">Disapproved</span>';
                        } else if (data == 'Approved') {
                            return '<span class="approved green">Approved</span>';
                        } else if (data == 'Waiting') {
                            return '<span class="waiting orange">Waiting</span>';
                        } else {
                            return 'Draft';
                        }
                    },
                },
                {
                    data: 'order_no',
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0, 2, 3, 4, 5, 6, 7],
                    className: 'dt-body-center',
                },
            ],
            order: [[0, 'desc']],
            scrollX: true,
        });
    },
    /* ------ ARCHITECT EDIT ------ */
    architectProjects: () => {
        return (architectProjectsTable = new DataTable('#architect-projects-table', {
            ajax: {
                url: `/architect/${architectID}/projects`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            columns: [
                {
                    data: 'project_id',
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => {
                        return `<input type="checkbox" class="row-checkbox" value="${data}">`;
                    },
                },
                {
                    data: 'project_id',
                    render: function (data) {
                        return '<a href="/project/' + data + '/edit">' + data + '</a>';
                    },
                },
                {
                    data: 'project_name',
                },
                {
                    data: 'quote_count',
                },
                {
                    data: 'status_desc',
                },
            ],
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    className: 'dt-body-center',
                    render: function (data, type, row, meta) {
                        if (type === 'display' && meta.row === 0) {
                            // Render a blank cell for data rows; header will be handled separately
                            return `<input type="checkbox" class="row-checkbox" value="${row.project_id}">`;
                        }
                        return `<input type="checkbox" class="row-checkbox" value="${row.project_id}">`;
                    },
                },
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [1, 3],
                    className: 'dt-body-center',
                },
            ],
            scrollX: true,
            fixedColumns: {
                start: 2,
                end: 2,
            },
            order: [[1, 'desc']],
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: null,
                bottomEnd: null,
            },
        }));
    },
    architectAddresses: () => {
        return (architectAddressesTable = new DataTable('#architect-addresses-table', {
            ajax: {
                url: `/architect/${architectID}/address`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // experimetal: server-side processing
            columns: [
                {
                    data: 'address_id',
                    render: function (data) {
                        return '<a href="/architect/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'name',
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0],
                    className: 'dt-body-center',
                },
            ],
            //"responsive": true,
            order: [[0, 'desc']],
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: null,
                bottomEnd: null,
            },
        }));
    },
    architectSpecifiers: () => {
        return (architectSpecifiersTable = new DataTable('#architect-specifiers-table', {
            ajax: {
                url: `/architect/${architectID}/fetchspecs`,
                dataSrc: '',
            } as AjaxSettings,
            processing: true,
            responsive: true,
            //serverSide: true, // experimetal: server-side processing
            columns: [
                {
                    data: 'specifier_id',
                    render: function (data) {
                        return '<a href="/architect/' + data + '/edit" class="text-blue-500 dark:text-blue-300">' + data + '</a>';
                    },
                },
                {
                    data: 'first_name',
                    render: function (data, type, row) {
                        return `${data} ${row.last_name}`;
                    },
                },
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-head-center',
                },
                {
                    targets: [0],
                    className: 'dt-body-center',
                },
            ],
            //"responsive": true,
            order: [[0, 'desc']],
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: null,
                bottomEnd: null,
            },
        }));
    },
};

interface DataTableElement extends HTMLElement {
    _DT_Instance?: Api<any>;
}

export function initTables() {
    const tables = document.querySelectorAll('.sTable');
    tables.forEach((table) => {
        const el = table as DataTableElement;
        const initType = el.dataset.init;

        if (!initType || !(initType in tableConfigs)) {
            console.warn(`No DataTable config found for: ${initType}`);
            return;
        }

        // Destroy previous instance if exists (vanilla)
        if (el._DT_Instance) {
            el._DT_Instance.destroy();
        }

        // Initialize and store instance on element
        el._DT_Instance = tableConfigs[initType](el);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const selectAllCheckbox = document.getElementById('select-all') as HTMLInputElement | null;

    selectAllCheckbox?.addEventListener('change', () => {
        const allCheckboxes = document.querySelectorAll<HTMLInputElement>('.row-checkbox');
        allCheckboxes.forEach((checkbox) => {
            checkbox.checked = selectAllCheckbox.checked;
        });
    });

    // Optional: uncheck "select all" if any row checkbox is manually unchecked
    document.addEventListener('change', (e) => {
        const target = e.target as HTMLElement;
        if (target && target.classList.contains('row-checkbox') && !target.closest('thead')) {
            const allCheckboxes = document.querySelectorAll<HTMLInputElement>('.row-checkbox');
            const checkedCheckboxes = document.querySelectorAll<HTMLInputElement>('.row-checkbox:checked');

            const selectAll = document.getElementById('select-all') as HTMLInputElement | null;
            if (selectAll) {
                selectAll.checked = allCheckboxes.length === checkedCheckboxes.length;
            }
        }
    });
});

document.getElementById('export-selected')?.addEventListener('click', function () {
    const selected: string[] = [];
    document.querySelectorAll<HTMLInputElement>('.row-checkbox:checked').forEach((cb) => {
        selected.push(cb.value);
    });

    if (selected.length === 0) {
        alert('Please select at least one project to export.');
        return;
    }

    const url = `/architect/${architectID}/projects?export=excel&ids=${selected.join(',')}`;
    window.location.href = url;
});

export { architectAddressesTable, architectProjectsTable, architectSpecifiersTable, itemTable, projectNoteTable };
