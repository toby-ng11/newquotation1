import { $projectId, $sheetType } from "./init.js";

let projectNoteTable;
let itemTable;

export function initTables() {
  /* ------ ADMIN PORTAL ------ */

  $("#admin-project-table").DataTable({
    ajax: {
      url: "/index/admin/project?view=true",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true, // experimetal: server-side processing
    columns: [
      {
        data: "project_id_ext",
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        render: function (data, type, row, meta) {
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
        targets: [0, 2, 3, 4, 5, 7, 8],
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

  $("#admin-quote-table").DataTable({
    ajax: {
      url: "/index/admin/quote?view=true",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true, // to-do: server-side processing with laminas
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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

  /* ------ PROJECT PORTAL ------ */

  $("#dashboard-project-own-table").DataTable({
    //select: true,
    ajax: {
      url: "/index/project/own?view=true",
      dataSrc: "",
    },
    columns: [
      {
        data: "project_id_ext",
        render: function (data, type, row, meta) {
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
        data: "shared_id",
      },
      {
        data: "market_segment_desc",
      },
      {
        data: "specifier_name",
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        render: function (data, type, row, meta) {
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
        targets: [0, 2, 3, 5, 6, 7],
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
          "<h2>My Projects</h2><p>" + ownTableCount + " projects";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-project-assigned-table").DataTable({
    //select: true,
    ajax: {
      url: "/index/project/assigned",
      dataSrc: "",
    },
    columns: [
      {
        data: "project_id_ext",
        render: function (data, type, row, meta) {
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
        data: "specifier_name",
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        render: function (data, type, row, meta) {
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
        targets: [0, 2, 3, 5, 6, 7],
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
          "<h2>Shared Projects</h2>" + assignTableCount + " shared projects";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-project-other-table").DataTable({
    ajax: {
      url: "/index/project/other",
      dataSrc: "",
    },
    columns: [
      {
        data: "project_id_ext",
        render: function (data, type, row, meta) {
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
        data: "specifier_name",
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
          } else {
            return date.toLocaleDateString();
          }
        },
      },
      {
        data: "project_id",
        render: function (data, type, row, meta) {
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
        targets: [0, 2, 3, 4, 6, 7],
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
      end: 1,
    },
    scrollX: true,
    layout: {
      topStart: function () {
        let info = document.createElement("div");
        info.innerHTML =
          "<h2>Other Projects At <?= $company ?></h2><p>" +
          otherTableCount +
          " projects at <?= $company ?>";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-project-quote-table").DataTable({
    ajax: {
      url: "/index/project/quote",
      dataSrc: "",
    },
    processing: true,
    //"serverSide": true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        info.innerHTML = "<h2>My Quotes</h2>" + quoteTableCount + " quotes";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-project-note-table").DataTable({
    ajax: {
      url: "/index/project/note",
      dataSrc: "",
    },
    processing: true,
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
        render: function (data, type, row, meta) {
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
        info.innerHTML = "<h2>Follow Up Notes</h2>" + noteTableCount + " notes";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  /* ------ APPROVAL PORTAL ------ */

  $("#dashboard-approve-waiting-table").DataTable({
    ajax: {
      url: "/index/approval/waiting",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
        info.innerHTML =
          "<h2>Waiting for Approval</h2><p>" +
          waitingTableCount +
          " quotes waiting for approval</p>";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-approve-approved-table").DataTable({
    ajax: {
      url: "/index/approval/approved",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        info.innerHTML =
          "<h2>Approved</h2><p>" + approvedTableCount + " approved quotes";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  $("#dashboard-approve-disapproved-table").DataTable({
    ajax: {
      url: "/index/approval/disapproved",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        render: function (data, type, row, meta) {
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
        info.innerHTML =
          "<h2>Disapproved</h2><p>" +
          disapprovedTableCount +
          " disapproved quotes";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  /* ------ PROJECT + QUOTE EDIT ------ */

  projectNoteTable = $("#note-table").DataTable({
    ajax: {
      url: "/note/table",
      data: {
        id: $projectId,
      },
      dataSrc: "",
    },
    processing: true,
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
        render: function (data, type, row, meta) {
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
        render: function (data) {
          if (!data) {
            return "<p><b>--</b></p>";
          }
          let date = new Date(data);
          return "<p><b>" + date.toLocaleString("en-CA") + "</b></p>";
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
        render: function (data) {
          if (isOwner) {
            return (
              '<div class="row-button">' +
              '<a title="Edit this note" class="note-edit" href="/note/fetch?id=' +
              data +
              '">' +
              '<span class="button-wrap">' +
              '<span class="icon icon-edit"></span>' +
              "</span></a>" +
              '<a title="Delete this note" class="note_delete" target="_blank" href="/note/delete?note_id=' +
              data +
              '"><span class="button-wrap"><span class="icon icon-delete"></span></span></a></div>'
            );
          } else {
            return null;
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

  itemTable = $("#item-table").DataTable({
    ajax: {
      url: "/item/table",
      data: {
        id: $projectId,
        type: $sheetType,
      },
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "item_id",
        render: function (data, type, row, meta) {
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
            $sheetType +
            '">' +
            '<span class="button-wrap">' +
            '<span class="icon icon-edit"></span>' +
            "</span></a>" +
            '<a title="Delete this item" class="item_delete" href="/item/delete?uid=' +
            data +
            "&type=" +
            $sheetType +
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

  $("#project-quote-table").DataTable({
    ajax: {
      url: `/project/${$projectId}/quotetable`,
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
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
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
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
        targets: [0, 2, 3, 4, 5, 6],
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
}

export { projectNoteTable, itemTable };
