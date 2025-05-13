import DataTable, { Api } from "datatables.net-dt";
import 'datatables.net-responsive-dt';
import 'datatables.net-fixedcolumns-dt';

import { projectID, sheetType, architectID } from "../../init";

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
        url: "/index/admin/project?view=true",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_id_ext",
        },
        {
          data: "project_name",
        },
        {
          data: "owner_id",
        },
        {
          data: "shared_id",
        },
        {
          data: "create_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "due_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "architect_name",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "status_desc",
        },
        {
          data: "project_id",
          render: function (data) {
            return (
              '<a target="_blank" href="/project/' +
              data +
              '/edit?open=make-quote"><span class="button-wrap"><span class="icon icon-money"></span></span></a>'
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 1, 3, 4, 5, 6, 8, 9],
          className: "dt-body-center",
        },
      ],
      //"responsive": true,
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>All projects</h2>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  adminQuote: (el) => {
    return new DataTable("#admin-quote-table", {
      ajax: {
        url: "/index/admin/quote?view=true",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // to-do: server-side processing with laminas
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "quote_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "expire_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "ship_required_date.date",
          render: function (data) {
            if (!data) {
              return "<p>--</p>";
            }
            let date = new Date(data);
            return "<p>" + date.toLocaleDateString("en-CA") + "</p>";
          },
        },
        {
          data: "project_status",
        },
        {
          data: "quote_status_id",
          render: function (data) {
            if (data == 4) {
              return '<span class="disapproved red">Disapproved</span>';
            } else if (data == 3) {
              return '<span class="approved green">Approved</span>';
            } else if (data == 2) {
              return '<span class="waiting orange">Waiting</span>';
            } else {
              return "Not submitted";
            }
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 4, 5, 6, 7],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>All quotes</h2>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  /* ------ HOME PORTAL ------ */
  homeOwnProject: () => {
    return new DataTable("#dashboard-home-own-table", {
      //select: true,
      ajax: {
        url: "/index/home/own?view=true",
        dataSrc: "",
      },
      processing: true,
      //responsive: true,
      columns: [
        {
          data: "project_id_ext",
          render: function (data, type, row) {
            return (
              "<a target='_blank' href='/project/" +
              row.project_id +
              "/edit' title='Edit project " +
              row.project_id +
              "'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "shared_id",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "architect_name",
        },
        {
          data: "quote_count",
        },
        {
          data: "create_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "due_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "status_desc",
        },
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 5, 6, 7, 8],
          className: "dt-body-center",
        },
      ],
      order: {
        name: "project_id",
        dir: "desc",
      },
      fixedColumns: {
        start: 1,
        end: 2,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML =
            "<h2>My Projects</h2><p>" + window.ownTableCount + " projects";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  homeSharedProject: () => {
    return new DataTable("#dashboard-home-assigned-table", {
      //select: true,
      ajax: {
        url: "/index/home/assigned",
        dataSrc: "",
      },
      //responsive: true,
      columns: [
        {
          data: "project_id_ext",
          render: function (data, type, row) {
            {
              return (
                "<a target='_blank' href='/project/" +
                row.project_id +
                "/edit'>" +
                data +
                "</a>"
              );
            }
          },
        },
        {
          data: "project_name",
        },
        {
          data: "owner_id",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "architect_name",
        },
        {
          data: "quote_count",
        },
        {
          data: "create_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "due_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "status_desc",
        },
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 5, 6, 7, 8],
          className: "dt-body-center",
        },
      ],
      processing: true,
      order: {
        name: "project_id",
        dir: "desc",
      },
      fixedColumns: {
        start: 1,
        end: 2,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML =
            "<h2>Shared Projects</h2>" + window.assignTableCount + " shared projects";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  homeOtherProject: () => {
    return new DataTable("#dashboard-home-other-table", {
      ajax: {
        url: "/index/home/other",
        dataSrc: "",
      },
      //responsive: true,
      columns: [
        {
          data: "project_id_ext",
          render: function (data, type, row) {
            return (
              "<a target='_blank' href='/project/" +
              row.project_id +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "owner_id",
        },
        {
          data: "shared_id",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "architect_name",
        },
        {
          data: "quote_count",
        },
        {
          data: "create_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "due_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "status_desc",
        },
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit?open=make-quote'><span class='button-wrap'><span class='icon icon-money'></span></span></a>"
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 4, 6, 7, 8],
          className: "dt-body-center",
        },
      ],
      processing: true,
      order: {
        name: "project_id",
        dir: "desc",
      },
      fixedColumns: {
        start: 1,
        end: 2,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML =
            "<h2>Other Projects At <?= $company ?></h2><p>" +
            window.otherTableCount +
            " projects at <?= $company ?>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  homeQuote: () => {
    return new DataTable("#dashboard-home-quote-table", {
      ajax: {
        url: "/index/home/quote",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //"serverSide": true,
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "quote_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "expire_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "ship_required_date.date",
          render: function (data) {
            if (!data) {
              return "<p>--</p>";
            }
            let date = new Date(data);
            return "<p>" + date.toLocaleDateString("en-CA") + "</p>";
          },
        },
        {
          data: "customer_name",
        },
        {
          data: "project_status",
        },
        {
          data: "quote_status_id",
          render: function (data) {
            if (data == 4) {
              return '<span class="disapproved red">Disapproved</span>';
            } else if (data == 3) {
              return '<span class="approved green">Approved</span>';
            } else if (data == 2) {
              return '<span class="waiting orange">Waiting</span>';
            } else {
              return "Not submitted";
            }
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 1, 3, 4, 5, 7, 8],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      fixedColumns: {
        start: 2,
        end: 2,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>My Quotes</h2>" + window.quoteTableCount + " quotes";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  homeNote: () => {
    return new DataTable("#dashboard-home-note-table", {
      ajax: {
        url: "/index/home/note",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      columns: [
        {
          data: "date_added.date",
          render: function (data) {
            let date = new Date(data);
            return "<p><b>" + date.toLocaleDateString("en-CA") + "</b></p>";
          },
        },
        {
          data: "project_id",
          render: function (data, type, row) {
            {
              return (
                "<a target='_blank' href='/project/" +
                row.project_id +
                "/edit'>" +
                row.project_id +
                "</a>"
              );
            }
          },
        },
        {
          data: "project_name",
        },
        {
          data: "next_action",
          render: function (data) {
            let formattedText = data.replace(/(?:\r\n|\r|\n)/g, "<br>");
            return "<p>" + formattedText + "</p>";
          },
        },
      ],
      columnDefs: [
        {
          targets: [0, 1, 2, 3],
          className: "dt-head-center",
        },
        {
          targets: [0, 1],
          className: "dt-body-center",
        },
      ],
      fixedColumns: {
        //start: 3
      },
      scrollX: true,
      order: [[0, "desc"]],
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML =
            "<h2>Follow Up Notes</h2>" + window.noteTableCount + " notes";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  /* ------ APPROVAL PORTAL ------ */
  approvalWaiting: () => {
    return new DataTable("#dashboard-approve-waiting-table", {
      ajax: {
        url: "/index/approval/waiting",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true,
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "architect_rep_id",
        },
        {
          data: "customer_name",
        },
        {
          data: "owner_name",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "quote_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "ship_required_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "quote_status",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 4, 5, 6, 7, 8],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>Waiting for Approval</h2>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  approvalApproved: () => {
    return new DataTable("#dashboard-approve-approved-table", {
      ajax: {
        url: "/index/approval/approved",
        dataSrc: "",
      },
      //responsive: true,
      processing: true,
      //serverSide: true,
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "architect_name",
        },
        {
          data: "customer_name",
        },
        {
          data: "owner_name",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "quote_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "expire_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "ship_required_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "quote_status",
        },
        {
          data: "order_no",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 4, 5, 6, 7, 8, 9, 10],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>Approved</h2>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  approvalDisapproved: () => {
    return new DataTable("#dashboard-approve-disapproved-table", {
      ajax: {
        url: "/index/approval/disapproved",
        dataSrc: "",
      },
      responsive: true,
      processing: true,
      //serverSide: true,
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "architect_name",
        },
        {
          data: "customer_name",
        },
        {
          data: "owner_name",
        },
        {
          data: "market_segment_desc",
        },
        {
          data: "quote_date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "expire_date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "ship_required_date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "quote_status",
        },
        {
          data: "quote_id",
          render: function (data, type, row) {
            return (
              "<a target='_blank' href='/quote/edit/id/" +
              row.quote_id +
              "'><span class='button-wrap'><span class='icon icon-edit'></span></span></a>"
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 4, 5, 6, 7, 8, 9, 10],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: function () {
          let info = document.createElement("div");
          info.innerHTML = "<h2>Disapproved</h2>";
          return info;
        },
        bottomStart: "pageLength",
      },
    });
  },
  /* ------ ARCHITECT PORTAL ------ */
  architectAll: () => {
    return new DataTable("#architect-all-table", {
      ajax: {
        url: "/index/architect/all",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "architect_id",
          render: function (data, type, row) {
            return (
              "<a target='_blank' href='/architect/" +
              row.architect_id +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "architect_name",
        },
        {
          data: "architect_rep_id",
        },
        {
          data: "architect_type_desc",
        },
        {
          data: "class_id",
        },
        {
          data: "project_count",
        },
        {
          data: "quote_count",
        },
        {
          data: "date_added.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 4, 5, 6],
          className: "dt-body-center",
        },
      ],
      //"responsive": true,
      order: [[0, "desc"]],
      fixedColumns: {
        start: 1,
        end: 1,
      },
      scrollX: true,
      layout: {
        topStart: null,
        topEnd: null,
        bottomStart: "search",
      },
    });
  },
  architectTop5: () => {
    return new DataTable("#top-5-architect-table", {
      ajax: {
        url: "/index/architect/topfive",
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "architect_name",
          render: function (data, type, row) {
            return (
              "<a target='_blank' href='/architect/" +
              row.architect_id +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "total_projects",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0],
          className: "dt-body-center",
        },
      ],
      //"responsive": true,
      order: {
        name: "total_projects",
        dir: "desc",
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
    return projectNoteTable = new DataTable("#note-table", {
      ajax: {
        url: `/project/${projectID}/note`,
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      columns: [
        {
          data: "date_added.date",
          render: function (data) {
            let date = new Date(data);
            return "<p><b>" + date.toLocaleDateString("en-CA") + "</b></p>";
          },
        },
        {
          data: "note_title",
          render: function (data, type, row) {
            if (data == "") {
              let formattedText = row.project_note.replace(
                /(?:\r\n|\r|\n)/g,
                "<br>"
              );
              return "<p>" + formattedText + "</p>";
            } else if (row.project_note == null) {
              // this is for old quote system rendering
              return "<p>" + data + "</p>";
            } else {
              let formattedText = row.project_note.replace(
                /(?:\r\n|\r|\n)/g,
                "<br>"
              );
              return "<p><b>" + data + "</b></br>" + formattedText + "</p>";
            }
          },
        },
        {
          data: "next_action",
          render: function (data) {
            let formattedText = data.replace(/(?:\r\n|\r|\n)/g, "<br>");
            return "<p>" + formattedText + "</p>";
          },
        },
        {
          data: "follow_up_date.date",
          render: function (data, type, row) {
            const isSent = row.notified_flag === "Y";
            if (!data) {
              return "--";
            }
            let date = new Date(data).toLocaleString("en-CA");
            if (isSent) {
              return `<span title="Reminder already sent">${date} <span class="tag tag-sent">Sent</span></span>`;
            }
            return date;
          },
        },
        {
          data: "owner_id",
          render: function (data) {
            if (data != null) {
              return "<p><b>" + data + "</b></p>";
            } else {
              return data;
            }
          },
        },
        {
          data: "project_note_id",
          render: function (data, type, row) {
            if (!window.isOwner) return null;

            const isSent = row.notified_flag === "Y";
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

            return `<div class="row-button">${buttons.join("")}</div>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 3, 4, 5],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      scrollX: true,
      fixedColumns: {
        end: 1,
      },
    });
  },
  item: () => {
    return itemTable = new DataTable("#item-table", {
      ajax: {
        url: "/item/table",
        data: {
          id: projectID,
          type: sheetType,
        },
        dataSrc: "",
      },
      processing: true,
      //responsive: true,
      columns: [
        {
          data: "item_id",
          render: function (data, type, row) {
            return (
              '<b class="item-name">' + data + "</b>" + "<br>" + row.item_desc
            );
          },
        },
        {
          data: "quantity",
          render: function (data) {
            let qty = Number.parseFloat(data).toFixed(0);
            return "<b>" + qty + "</b>";
          },
        },
        {
          data: "unit_price",
          render: function (data) {
            return "<b>" + data + "</b>";
          },
        },
        {
          data: "uom",
          render: function (data) {
            return "<b>" + data + "</b>";
          },
        },
        {
          data: "subtotal",
          render: function (data) {
            return "<b>" + data + "</b>";
          },
        },
        {
          data: "note",
          render: function (data) {
            let formattedText = data.replace(/(?:\r\n|\r|\n)/g, "<br>");
            return "<p>" + formattedText + "</p>";
          },
        },
        {
          data: "item_uid",
          render: function (data) {
            //var oldData = getolddata($(this).closest('tr'));
            return (
              '<div class="row-button">' +
              '<a title="Edit this item" class="item-edit" href="/item/fetch?uid=' +
              data +
              "&type=" +
              sheetType +
              '">' +
              '<span class="button-wrap">' +
              '<span class="icon icon-edit"></span>' +
              "</span></a>" +
              '<a title="Delete this item" class="item_delete" href="/item/delete?uid=' +
              data +
              "&type=" +
              sheetType +
              '">' +
              '<span class="button-wrap">' +
              '<span class="icon icon-delete"></span>' +
              "</span></a></div>"
            );
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 1, 2, 3, 4],
          className: "dt-body-center",
        },
      ],
      layout: {
        topStart: null,
        topEnd: null,
      },
      order: [[7, "desc"]], // sort by item uid, newest item on top
      paging: false,
      scrollX: true,
      fixedColumns: {
        start: 1,
        end: 1,
      },
      //rowReorder: true
    });
  },
  projectQuote: () => {
    return new DataTable("#project-quote-table", {
      ajax: {
        url: `/project/${projectID}/quotetable`,
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      columns: [
        {
          data: "quote_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/quote/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "customer_name",
        },
        {
          data: "contact_full_name",
        },
        {
          data: "quote_date.date",
          render: function (data) {
            let date = new Date(data);
            return date.toLocaleDateString();
          },
        },
        {
          data: "expire_date.date",
          render: function (data) {
            let date = new Date(data);
            let today = new Date();
            if (date <= today) {
              return (
                '<span class="red">' + date.toLocaleDateString() + "</span>"
              );
            } else {
              return date.toLocaleDateString();
            }
          },
        },
        {
          data: "ship_required_date.date",
          render: function (data) {
            if (!data) {
              return "<p>--</p>";
            }
            let date = new Date(data);
            return "<p>" + date.toLocaleDateString("en-CA") + "</p>";
          },
        },
        {
          data: "quote_status",
          render: function (data) {
            if (data == "Dissapproved") {
              return '<span class="disapproved red">Disapproved</span>';
            } else if (data == "Approved") {
              return '<span class="approved green">Approved</span>';
            } else if (data == "Waiting") {
              return '<span class="waiting orange">Waiting</span>';
            } else {
              return "Draft";
            }
          },
        },
        {
          data: "order_no",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2, 3, 4, 5, 6, 7],
          className: "dt-body-center",
        },
      ],
      order: [[0, "desc"]],
      scrollX: true,
      layout: {
        topStart: null,
        topEnd: null,
      },
    });
  },
  /* ------ ARCHITECT EDIT ------ */
  architectProjects: () => {
    return architectProjectsTable = new DataTable("#architect-projects-table", {
      ajax: {
        url: `/architect/${architectID}/projects`,
        dataSrc: "",
      },
      processing: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "project_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/project/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "project_name",
        },
        {
          data: "quote_count",
        },
        {
          data: "status_desc",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0, 2],
          className: "dt-body-center",
        },
      ],
      scrollX: true,
      fixedColumns: {
        start: 1,
        end: 2,
      },
      order: [[0, "desc"]],
      layout: {
        topStart: null,
        topEnd: null,
        bottomStart: null,
        bottomEnd: null,
      },
    });
  },
  architectAddresses: () => {
    return architectAddressesTable = new DataTable("#architect-addresses-table", {
      ajax: {
        url: `/architect/${architectID}/address`,
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "address_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/architect/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "name",
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0],
          className: "dt-body-center",
        },
      ],
      //"responsive": true,
      order: [[0, "desc"]],
      layout: {
        topStart: null,
        topEnd: null,
        bottomStart: null,
        bottomEnd: null,
      },
    });
  },
  architectSpecifiers: () => {
    return architectSpecifiersTable = new DataTable("#architect-specifiers-table", {
      ajax: {
        url: `/architect/${architectID}/fetchspecs`,
        dataSrc: "",
      },
      processing: true,
      responsive: true,
      //serverSide: true, // experimetal: server-side processing
      columns: [
        {
          data: "specifier_id",
          render: function (data) {
            return (
              "<a target='_blank' href='/architect/" +
              data +
              "/edit'>" +
              data +
              "</a>"
            );
          },
        },
        {
          data: "first_name",
          render: function (data, type, row) {
            return `${data} ${row.last_name}`;
          },
        },
      ],
      columnDefs: [
        {
          targets: "_all",
          className: "dt-head-center",
        },
        {
          targets: [0],
          className: "dt-body-center",
        },
      ],
      //"responsive": true,
      order: [[0, "desc"]],
      layout: {
        topStart: null,
        topEnd: null,
        bottomStart: null,
        bottomEnd: null,
      },
    });
  },
};

interface DataTableElement extends HTMLElement {
  _DT_Instance?: Api<any>;
}

export function initTables() {
  const tables = document.querySelectorAll(".sTable");
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

export {
  projectNoteTable,
  itemTable,
  architectProjectsTable,
  architectAddressesTable,
  architectSpecifiersTable,
};
