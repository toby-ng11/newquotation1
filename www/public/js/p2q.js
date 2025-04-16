$(function () {
  /* --------------------------  GLOBAL VARIABLES ---------------------------- */

  const $projectId = window.location.pathname.split("/")[2];
  const $quoteId = window.location.pathname.split("/")[2];
  const $sheetType = window.location.pathname.split("/")[1];
  const $projectForm = $("#project_content");
  const $quoteForm = $("#quote-content");

  /* --------------------------  TABLES ---------------------------- */

  /* ------ ADMIN PORTAL ------ */

  let adminProjectTable = $("#admin-project-table").DataTable({
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

  let adminQuoteTable = $("#admin-quote-table").DataTable({
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
          return "<p><b>" + date.toLocaleString("en-CA") + "</b></p>";
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

  let projectNoteTable = $("#project_note").DataTable({
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
          return "<p><b>" + date.toLocaleString("en-CA") + "</b></p>";
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

  let itemTable = $("#item-table").DataTable({
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

  let projectQuoteTable = $("#project-quote-table").DataTable({
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

  /* -------------------------- GLOBAL FUNCTIONS ---------------------------- */
  function resetForm($form) {
    $form
      .find(
        "input:hidden, input:text, input:password, input:file, select, textarea"
      )
      .val("")
      .trigger("change");
    $form
      .find("input:radio, input:checkbox")
      .prop("checked", false)
      .prop("selected", false)
      .trigger("change");
    $form.find("select").each(function () {
      let $select = $(this);
      if ($select.data("default-options")) {
        $select.html($select.data("default-options"));
      }
      $select.prop("selectedIndex", 0).trigger("change");
    });
    $form.find("input, select, textarea").prop("disabled", false);
  }

  // Utility function to enable/disable buttons
  function disableButton($button, state) {
    $button.prop("disabled", state);
  }

  /* --------------------------  ITEM FUNCTION ---------------------------- */

  let isEditItem = false;
  let isUOMChanged = false;

  const $dialogItem = $("#dialog-item");
  const $itemForm = $("#dialog-item-form");
  const $dialogBtnAddItem = $("#item-form-btn-add");
  const $uomDropdown = $("#uom");

  $uomDropdown.data("default-options", $uomDropdown.html());

  // Open Edit Dialog
  $(document).on("click", "a.item-edit", function (e) {
    e.preventDefault();

    isEditItem = true;

    $dialogItem.dialog("option", "title", "Edit Item");
    $dialogItem.dialog("open");
    $dialogBtnAddItem.text("Save Changes");

    $.ajax({
      url: $(this).attr("href"),
      type: "GET",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.data) {
          const data = response.data;

          $("#dialog-item-form #item_uid").val(data["item_uid"] || "");
          $("#dialog-item-form #item_id").val(data["item_id"] || "");
          //$("#dialog-item-form #unit_price").val(data["unit_price"] || "");
          $("#dialog-item-form #quantity").val(data["quantity"] || "");
          $("#dialog-item-form #note").val(data["note"] || "");
          $("#dialog-item-form #uom").val(data["uom"] || "");

          getoum(
            data["item_id"],
            data["uom"],
            data["unit_price"],
            data["item_uid"]
          );
        } else {
          alert(response.message || "Failed to fetch item data.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error deleting item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      });
  });

  // Open Add Item Dialog
  $("#widget-btn-add-item").on("click", function () {
    isEditItem = false;
    $dialogItem.dialog("option", "title", "Add Item");
    $dialogItem.dialog("open");
    $dialogBtnAddItem.text("Add Item");
  });

  // Item Dialog Setup
  $("#dialog-item").dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 800,
    //minHeight: 600,
    open: function () {
      // fade in background
      resetForm($itemForm);
      $(".ui-widget-overlay").hide().fadeIn().css("z-index", 1000);
      $(".ui-dialog").css("z-index", 2000);
    },
    beforeClose: function () {
      //fade out background
      $(".ui-widget-overlay").fadeOut(400, function () {
        $(this).remove();
      });
    },
    dialogClass: "add-item-dialog",
    buttons: [
      {
        id: "item-form-btn-add",
        text: "Save",
        click: function () {
          if ($itemForm.validationEngine("validate")) {
            disableButton($dialogBtnAddItem, true);
            if (!isEditItem) {
              additem();
            } else {
              edititem();
            }
            $(this).dialog("close");
            //resetForm($itemForm);
            setTimeout(() => disableButton($dialogBtnAddItem, false), 1000);
          }
        },
        "aria-label": "Add Item",
      },
      {
        id: "item-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  // Autocomplete for Item ID
  if ($(".dialog #item_id").length) {
    $(".dialog #item_id")
      .autocomplete({
        appendTo: "#dialog-item-form",
        source: function (request, response) {
          $.ajax({
            url: "/item/index",
            dataType: "json",
            data: { term: request.term, limit: 10 },
          })
            .done((data) => response(data))
            .fail((jqXHR, textStatus, errorThrown) => {
              console.error(
                "AJAX Error: ",
                textStatus,
                errorThrown,
                jqXHR.responseText
              );
              response([]);
            });
        },
        minLength: 2,
        open: function (event, ui) {
          $("ui-autocomplete").css("z-index", 2001);
        },
        select: function (event, ui) {
          if (ui.item && ui.item.item_id) {
            $("#item_id").val(ui.item.item_id);
            $("#item_input").val(ui.item.item_desc);
            getoum(ui.item.item_id);
            $("#uom").prop("disabled", false).removeClass("disabled");
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          $("<div>")
            .addClass("autocomplete-item")
            .append($("<strong>").text(item.item_id))
            .append($("<span>").text(" - " + item.item_desc))
        )
        .appendTo(ul);
    };
  }

  // Fetch price when UOM changes
  $uomDropdown.on("change", function () {
    getP21Price($("#item_id").val(), $("#uom").val());
  });

  // Fetch UOMs and select the old one when editing
  function getoum(item_id, old_uom = null, old_price = null, item_uid = null) {
    if (!item_id) return;
    $.ajax({
      url: "/item/uom",
      dataType: "json",
      data: { term: item_id },
      type: "get",
    })
      .done(function (data) {
        $uomDropdown.empty();

        $.each(data, function (i, item) {
          let option = $("<option></option>")
            .attr("value", item.uom)
            .text(item.uom);

          //set the selected UOM if editing
          if (old_uom && item.uom === old_uom) {
            option.attr("selected", "selected");
          }

          $uomDropdown.append(option);
        });

        if (isEditItem) {
          getQuotedPrice(item_uid, $sheetType);
        } else {
          getP21Price(item_id, old_uom || $("#uom").val(), old_price);
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  // Fetch P21 Item Price
  function getP21Price(item_id, uom, old_price = null) {
    if (!item_id || !uom) return;
    $.ajax({
      url: "/item/price",
      data: { item_id, uom },
      dataType: "json",
    })
      .done((data) => {
        $("#unit_price").val(data?.price || old_price || "");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching price:", textStatus, errorThrown);
      });
  }

  function getQuotedPrice(item_uid, type) {
    if (!item_uid) return;
    $.ajax({
      url: "/item/quotedprice",
      data: { item_uid, type },
      dataType: "json",
    })
      .done((data) => {
        $("#unit_price").val(data?.unit_price || "");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching price:", textStatus, errorThrown);
      });
  }

  // Add Item Function
  function additem() {
    disableButton($dialogBtnAddItem, true);
    let formData =
      $itemForm.serialize() +
      "&project_id=" +
      encodeURIComponent($projectId) +
      "&type=" +
      encodeURIComponent($sheetType);

    $.ajax({
      url: "/item/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => {
        itemTable.ajax.reload();
        showFlashMessage("Item added successfully!");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add item. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddItem, false));
  }

  // Edit Item Function
  function edititem() {
    disableButton($dialogBtnAddItem, true);
    let formData =
      $itemForm.serialize() + "&type=" + encodeURIComponent($sheetType);
    $.ajax({
      url: "/item/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => {
        itemTable.ajax.reload();
        showFlashMessage("Item saved.");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit item. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddItem, false));
  }

  // Handle Item Delete
  $(document).on("click", ".item_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this item?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "GET",
      })
        .done(() => itemTable.ajax.reload())
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(
            "Error deleting item:",
            textStatus,
            errorThrown,
            jqXHR.responseText
          );
        });
    }
  });

  /* --------------------------  NOTE FUNCTION ---------------------------- */

  const $noteForm = $("#note");
  const $dialogNote = $("#dialog-message");
  const $dialogBtnAddNote = $("#note-form-btn-add");

  let isEditnote = false;

  flatpickr("#follow_up_date", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
  });

  $("#dialog-message").dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 1000,
    height: 650,
    open: function () {
      // fade in background
      resetForm($noteForm);
      $(".ui-widget-overlay").hide().fadeIn().css("z-index", 1000);
      $(".ui-dialog").css("z-index", 2000);
    },
    beforeClose: function () {
      //fade out background
      $(".ui-widget-overlay").fadeOut(400, function () {
        $(this).remove();
      });
    },
    dialogClass: "add-note-dialog",
    buttons: [
      {
        id: "note-form-btn-add",
        text: "Add Log",
        click: function () {
          if ($noteForm.validationEngine("validate")) {
            if (!isEditnote) {
              addnote();
            } else {
              editnote();
            }
            $(this).dialog("close");
            setTimeout(() => disableButton($dialogBtnAddNote, false), 1000);
          }
        },
        "aria-label": "Add Log",
      },
      {
        id: "note-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  $(document).on("click", ".note-edit", function (e) {
    e.preventDefault();

    isEditnote = true;

    $dialogNote.dialog("option", "title", "Edit Log");
    $dialogNote.dialog("open");
    $dialogBtnAddNote.text("Save Changes");

    $.ajax({
      url: $(this).attr("href"),
      type: "GET",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.data) {
          const data = response.data;
          $("#note #note_id").val(data["project_note_id"] || "");
          $("#note #note_title").val(data["note_title"] || "");
          $("#note #project_note").val(data["project_note"] || "");
          $("#note #next_action").val(data["next_action"] || "");
          if (data["follow_up_date"]) {
            let followUpDate = data["follow_up_date"]["date"];
            $("#note #follow_up_date").val(followUpDate);
          }
        } else {
          alert(response.message || "Failed to fetch note data.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error fetch note data:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      });
  });

  $("#widget-btn-add-note").on("click", function () {
    isEditnote = false;
    $dialogNote.dialog("option", "title", "Add Log");
    $dialogNote.dialog("open");
    $dialogBtnAddNote.text("Add Note");
  });

  function addnote() {
    disableButton($dialogBtnAddNote, true);
    let formData =
      $noteForm.serialize() + "&project_id=" + encodeURIComponent($projectId);
    $.ajax({
      url: "/note/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => {
        projectNoteTable.ajax.reload();
        showFlashMessage("Note added!");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add note. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddNote, false));
  }

  function editnote() {
    disableButton($dialogBtnAddNote, true);
    let formData = $noteForm.serialize();

    $.ajax({
      url: "/note/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => {
        projectNoteTable.ajax.reload();
        showFlashMessage("Note saved.");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error editing note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit note. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddNote, false));
  }

  $(document).on("click", ".note_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this log?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "get",
      })
        .done(() => projectNoteTable.ajax.reload())
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(
            "Error deleting item:",
            textStatus,
            errorThrown,
            jqXHR.responseText
          );
        });
    }
  });

  /* --------------------------  MAKE QUOTE FUNCTION ---------------------------- */

  const $makeQuoteForm = $("#dialog-make-quote-form");
  const $dialogMakeQuote = $("#dialog-make-quote");
  const $dialogBtnAddCustomer = $("#customer-form-btn-add");

  let $customerFields = $(
    "#customer_id, #customer_name, #company_id, #salesrep_full_name"
  );
  let $contactDropdown = $("#contact_name");
  let $contactFields = $(
    "#contact_id, #first_name, #last_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address"
  );

  $contactDropdown.data("default-options", $contactDropdown.html());
  //$contactFields.prop("readonly", true);

  $dialogMakeQuote.dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 1200,
    height: 650,
    open: function () {
      // fade in background
      resetForm($makeQuoteForm);
      $(".ui-widget-overlay").hide().fadeIn().css("z-index", 1000);
      $(".ui-dialog").css("z-index", 2000);
    },
    beforeClose: function () {
      //fade out background
      $(".ui-widget-overlay").fadeOut(400, function () {
        $(this).remove();
      });
    },
    dialogClass: "add-customer-dialog",
    buttons: [
      {
        id: "customer-form-btn-add",
        text: "Make Quote",
        click: function () {
          if ($makeQuoteForm.validationEngine("validate")) {
            disableButton($dialogBtnAddCustomer, true);
            makeQuote();
            $(this).dialog("close");
            setTimeout(() => disableButton($dialogBtnAddCustomer, false), 1000);
          }
        },
        "aria-label": "Make Quote",
      },
      {
        id: "customer-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  $("#widget-btn-add-quote, .make-quote").on("click", function (e) {
    //$dialogNote.dialog("option", "title", "Add Log");
    e.preventDefault();
    $dialogMakeQuote.dialog("open");
  });

  function initCustomerAutocomplete($section) {
    $section
      .find("input[id$='_customer_name']")
      .autocomplete({
        appendTo:
          $section.data("type") === "dialog" ? "#dialog-make-quote-form" : null,
        source: function (request, response) {
          $.ajax({
            url: "/customer",
            dataType: "json",
            data: { term: request.term, limit: 10 },
          })
            .done(response)
            .fail(() => response([]));
        },
        minLength: 2,
        select: function (event, ui) {
          if (ui.item && ui.item.customer_id) {
            // Populate all customer fields dynamically
            [
              "customer_id",
              "customer_name",
              "company_id",
              "salesrep_full_name",
            ].forEach((field) => {
              $section
                .find(`#${$section.data("type")}_${field}`)
                .val(ui.item[field] || "");
            });
            getCustomerContacts(ui.item.customer_id, $section);
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          `<div><strong>${item.customer_id}</strong> - ${item.customer_name}</div>`
        )
        .appendTo(ul);
    };
  }

  function getCustomerContacts(customer_id, $section) {
    if (!customer_id) return;
    $.ajax({
      url: `/customer/${customer_id}/contacts`,
      dataType: "json",
    }).done((data) => {
      const $contactDropdown = $section
        .find("select[id$='_contact_name']")
        .empty();
      $.each(data, (i, item) => {
        $contactDropdown.append(
          `<option value="${item.contact_id}">${item.contact_full_name}</option>`
        );
      });
      getContactInfo($section);
    });
  }

  function getContactInfo($section) {
    const contactID = $section.find("select[id$='_contact_name']").val();
    if (!contactID) return;
    $.ajax({
      url: `/customer/${contactID}/contactinfo`,
      dataType: "json",
    }).done((data) => {
      // Fill contact fields dynamically based on ID suffix
      [
        "contact_id",
        "first_name",
        "last_name",
        "phys_address1",
        "phys_address2",
        "phys_city",
        "phys_state",
        "phys_postal_code",
        "phys_country",
        "central_phone_number",
        "email_address",
      ].forEach((field) => {
        $section
          .find(`#${$section.data("type")}_${field}`)
          .val(data[field] || "");
      });
    });
  }

  // Initialize both sections (main and dialog)
  $(".customer-section").each(function () {
    const $section = $(this);
    initCustomerAutocomplete($section);
    $section
      .find("select[id$='_contact_name']")
      .on("change", () => getContactInfo($section));
  });

  function makeQuote() {
    disableButton($dialogBtnAddCustomer, true);

    let contactID = $("#dialog_contact_id").val();
    let formData = "";
    if ($sheetType === "project") {
      // if make quote from project page
      formData =
        $projectForm.serialize() +
        "&contact_id=" +
        encodeURIComponent(contactID) +
        "&project_id=" +
        encodeURIComponent($projectId) +
        "&sheetType=" +
        encodeURIComponent($sheetType);
    }

    if ($sheetType === "quote") {
      // if make quote from quote page
      formData =
        "&contact_id=" +
        encodeURIComponent(contactID) +
        "&project_id=" +
        encodeURIComponent($("#project_id").val());
      "&sheetType=" + encodeURIComponent($sheetType);
    }

    $(".loading").show();

    $.ajax({
      url: "/quote",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.quote_id) {
          window.location.href = `/quote/${response.quote_id}/edit`;
        } else {
          alert(response.message || "Failed to make quote. Please try again.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error making quote:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to make quote. Please try again.");
      })
      .always(() => {
        disableButton($dialogBtnAddCustomer, false);
        $(".loading").hide();
      });
  }

  /* ------------------------------   For project/{new, edit} ---------------------------------*/
  if ($("#shared_id").length) {
    $("#shared_id")
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/user/fetchbypattern",
            dataType: "json",
            data: {
              pattern: request.term,
              limit: 10,
            },
            success: function (data) {
              response(data);
            },
            error: function () {
              response([]); // Handle errors gracefully
            },
          });
        },
        minLength: 1,
        select: function (event, ui) {
          $("#shared_id").val(ui.item.id);
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          "<div><strong>" + item.id + "</strong><br>" + item.name + "</div>"
        )
        .appendTo(ul);
    };
  }

  /* ----------------------------- Architect / Specifier -------------------------------- */

  let architectFields = $(
    "#architect_name, #architect_id, #architect_company_id, #architect_rep_id, " +
      "#architect_type_id, #architect_class_id"
  );

  let addressDropdown = $("#address_list");
  let addressFields = $(
    "#address_id, #address_name, #phys_address1, " +
      "#phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, " +
      "#central_phone_number, #email_address, #url"
  );

  let specifierDropdown = $("#specifier_name");
  let specifierFields = $(
    "#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, " +
      "#specifier_job_title, #specifier_phone_number, #specifier_email"
  );

  $("#add_architect").on("click", function () {
    [architectFields, addressFields, specifierFields].forEach((field) =>
      field.val("").prop("readonly", false)
    );
    [addressDropdown, specifierDropdown].forEach((dropdown) =>
      dropdown.html(
        '<option value="">-- Please search for an architect first --</option>'
      )
    );
  });

  if ($("#architect_name").length) {
    $("#architect_name")
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/architect",
            dataType: "json",
            data: {
              search: request.term,
              limit: 10,
            },
          })
            .done(function (data) {
              response(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.error(
                "AJAX Error: ",
                textStatus,
                errorThrown,
                jqXHR.responseText
              );
              response([]); // Handle failure gracefully
            });
        },
        minLength: 1,
        select: function (event, ui) {
          if (ui.item && ui.item.architect_id) {
            getArchitectById(ui.item.architect_id);
            getAddress(ui.item.architect_id);
            getSpecifier(ui.item.architect_id);
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          $("<div>")
            .addClass("autocomplete-item")
            .append($("<strong>").text(item.architect_name))
            .append($("<br>"))
            .append(
              $("<span>").text(item.architect_rep_id + " - " + item.company_id)
            )
        )
        .appendTo(ul);
    };
  }

  function getArchitectById(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/fetchfull`,
      dataType: "json",
      type: "get",
    })
      .done(function (architect) {
        if (architect) {
          architectFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(architect[fieldName] || "");
            $("#architect_company_id").val(architect.company_id);
            $("#architect_name").prop("readonly", false);
          });
        } else {
          // Clear fields if no architect found
          architectFields.val("").prop("readonly", false);
          console.warn("No architect data found for ID:", id);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching architect details:",
          textStatus,
          errorThrown
        );
      });
  }

  function getAddress(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/address`,
      dataType: "json",
      type: "get",
    })
      .done(function (address) {
        addressDropdown.empty();
        if (!address || address.length === 0) {
          addressDropdown.html(
            '<option value="">No addresses found, please add.</option>'
          );
          addressFields.val("").prop("readonly", false);
          return;
        } else {
          $.each(address, function (i, item) {
            addressDropdown.append(
              '<option value="' +
                item.address_id +
                '">' +
                item.name +
                "</option>"
            );
          });
          addressDropdown.append(
            '<option value="new">+ Add New Address</option>'
          );
          addressDropdown.prop("selectedIndex", 0);
          getAddressInfo();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching address:", textStatus, errorThrown);
      });
  }

  function getSpecifier(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/fetchspecs`,
      dataType: "json",
      type: "get",
    })
      .done(function (specifiers) {
        specifierDropdown.empty();
        if (!specifiers || specifiers.length === 0) {
          $("#specifier_name").html(
            '<option value="">No specifiers found, please add.</option>'
          );
          specifierFields.val("").prop("readonly", false);
          return;
        } else {
          $.each(specifiers, function (i, item) {
            specifierDropdown.append(
              '<option value="' +
                item.specifier_id +
                '">' +
                item.first_name +
                " " +
                item.last_name +
                "</option>"
            );
          });
          specifierDropdown.append(
            '<option value="new">+ Add New Specifier</option>'
          );
          specifierDropdown.prop("selectedIndex", 0);
          getSpecifierInfo();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  $("#specifier_name").on("change", function () {
    if ($(this).val() === "new") {
      // for add new specifier
      specifierFields.val("");
      specifierFields.prop("readonly", false);
    } else {
      getSpecifierInfo();
    }
  });

  $("#address_list").on("change", function () {
    if ($(this).val() === "new") {
      // for add new specifier
      addressFields.val("");
      addressFields.prop("readonly", false);
    } else {
      getAddressInfo();
    }
  });

  function getSpecifierInfo() {
    let specifierId = $("#specifier_name").val();
    if (!specifierId || specifierId === "new") return;
    $.ajax({
      url: `/architect/${specifierId}/specinfo`,
      dataType: "json",
      type: "get",
    })
      .done(function (specifier) {
        if (specifier) {
          specifierFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(specifier[fieldName] || "");
            $("#specifier_address_id").val(specifier.address_id);
            $("#specifier_first_name").val(specifier.first_name);
            $("#specifier_last_name").val(specifier.last_name);
            $("#specifier_job_title").val(specifier.job_title);
            $("#specifier_phone_number").val(specifier.central_phone_number);
            $("#specifier_email").val(specifier.email_address);
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching specifier details:",
          textStatus,
          errorThrown
        );
      });
  }

  function getAddressInfo() {
    let addressID = $("#address_list").val();
    if (!addressID || addressID === "new") return;
    $.ajax({
      url: `/architect/${addressID}/addressinfo`,
      dataType: "json",
      type: "get",
    })
      .done(function (address) {
        if (address) {
          addressFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(address[fieldName] || "");
            $("#address_name").val(address.name);
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching specifier details:",
          textStatus,
          errorThrown
        );
      });
  }

  /* ----------------------------- Contractor / Customer -------------------------------- */

  function setupAutocomplete(selector, sourceUrl, selectCallback) {
    if ($(selector).length) {
      $(selector)
        .autocomplete({
          source: sourceUrl,
          minLength: 2,
          select: function (event, ui) {
            selectCallback(ui.item);
          },
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
        return $("<li>")
          .data("item.autocomplete", item)
          .append(
            "<a>" +
              (item.customer_id +
                " - " +
                item.company_id +
                "<br>" +
                item.customer_name) +
              "</a>"
          )
          .appendTo(ul);
      };
    }
  }

  setupAutocomplete(
    "#general_contractor_name",
    "/customer/fetch",
    function (item) {
      getContractor(item.customer_id, "general_contractor");
    }
  );

  setupAutocomplete(
    "#awarded_contractor_name",
    "/customer/fetch",
    function (item) {
      getContractor(item.customer_id, "awarded_contractor");
    }
  );

  function getContractor(id, targetPrefix) {
    $.ajax({
      url: `/customer/${id}/fetchbyid/`,
      dataType: "json",
      type: "get",
      success: function (result) {
        if (result) {
          $("#" + targetPrefix + "_id").val(result.customer_id);
          $("#" + targetPrefix + "_name").val(result.customer_name);
        }
      },
    });
  }

  /* ----------------------------- Page Load -------------------------------- */

  let unsave = false;
  let lastChanged = null;

  window.onbeforeunload = function () {
    if (unsave) {
      if (lastChanged === "project")
        $("#form-btn-save-project").trigger("focus");
      if (lastChanged === "quote") $("#form-btn-save-quote").trigger("focus");
      return "You have unsaved changes. Do you want to leave this page and discard your changes or stay on this page?";
    }
  };

  /*------------------------ Project -------------------------*/
  const $architectDetails = $("#architect-details");
  const architectName = $("#architect_name").val();

  const $contractorDetails = $("#contractor-details");
  const generalContractor = $("#general_contractor_name").val();
  const awardedContractor = $("#awarded_contractor_name").val();

  // Auto expand architect details
  if ($architectDetails.length && architectName.trim() != "") {
    $architectDetails.prop("open", true);
  }

  // Auto expand contractor details
  // if either general or awarded contractor field is available (check with length)
  if (
    $contractorDetails.length &&
    (generalContractor.trim() != "" || awardedContractor.trim() != "")
  ) {
    $contractorDetails.prop("open", true);
  }

  // Enable save button
  $projectForm.on("change", function () {
    $("#form-btn-save-project").prop("disabled", false);
    unsave = true;
    lastChanged = "project";
  });

  // Save edit
  $("#form-btn-save-project").on("click", function (e) {
    e.preventDefault();
    if ($projectForm.validationEngine("validate")) {
      if ($("#general_contractor_name").val().trim() === "")
        $("#general_contractor_id").val("");
      if ($("#awarded_contractor_name").val().trim() === "")
        $("#awarded_contractor_id").val("");

      $(".loading").show();
      unsave = false;

      // Submit via AJAX
      $.ajax({
        url: $projectForm.attr("action"),
        type: $projectForm.attr("method"),
        data: $projectForm.serialize(),
        dataType: "json",
      })
        .done(function (response) {
          if (response.success) {
            window.location.href = response.redirect;
          } else {
            alert(response.message || "Failed to save project.");
          }
        })
        .fail(function (xhr, status, error) {
          console.error("Save failed:", error);
          alert("An error occurred while saving the project.");
        })
        .always(function () {
          $(".loading").hide(); // Hide loading in all cases
        });
    }
  });

  // Delete project
  $(".delete_pro").on("click", async function () {
    if (!confirm("Are you sure you want to delete this project?")) return;

    $(".loading").show();

    try {
      const response = await $.ajax({
        url: `/project/${$projectId}/delete`,
        type: "GET",
        dataType: "json",
      });

      if (response.success) {
        window.location.href = "/index/project";
      } else {
        alert(response.message || "Failed to delete the project.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error occurred while deleting the project.");
    } finally {
      $(".loading").hide();
    }
  });

  /*------------------------ Quote -------------------------*/

  // Enable save button
  $quoteForm.on("change", function () {
    $("#form-btn-save-quote").prop("disabled", false);
    unsave = true;
    lastChanged = "quote";
  });

  // Save edit
  $("#form-btn-save-quote").on("click", function (e) {
    e.preventDefault();
    $quoteForm.trigger("submit");
    unsave = false;
  });

  // Submit approval
  $(".quote-action-button").on("click", async function (e) {
    e.preventDefault();

    const $button = $(this);
    const action = $button.data("action");
    const label = $button.data("label")?.toLowerCase();

    if (!action) return;

    // Only validate for 'submit' and 'approve' actions
    const requiresValidation = ["submit", "approve", "submit-approve"].includes(
      action
    );
    if (requiresValidation && !$quoteForm.validationEngine("validate")) return;

    if (!confirm(`You are about to ${label} this quote. Continue?`)) return;

    $button.prop("disabled", true);
    unsave = false;
    let formData = $quoteForm.serialize();
    $(".loading").show();

    try {
      const response = await $.post(`/quote/${$quoteId}/${action}`, formData);

      if (response.success) {
        window.scrollTo(0, 0);
        location.reload();
      } else {
        alert(response.message || `Failed to ${label} the quote.`);
      }
    } catch (error) {
      console.error(`Submit failed:`, error);
      alert(`Error occurred while trying to ${label} the quote.`);
    } finally {
      $(".loading").hide();
      setTimeout(() => $button.prop("disabled", false), 1000); // Prevents spam clicking
    }
  });

  $(".delete_quote").on("click", async function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this quote?") == true) {
      unsave = false;
      $(".loading").show();
      try {
        const response = await $.ajax({
          url: `/quote/${$quoteId}/delete`,
          type: "GET",
          dataType: "json",
        });

        if (response.success) {
          window.location.href = "/index/project";
        } else {
          alert(response.message || "Failed to delete the quote.");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Error occurred while deleting the quote.");
      } finally {
        $(".loading").hide();
      }
    }
  });

  $("a.quote-edit-again").on("click", function (e) {
    if (
      confirm("You are about to edit this approved quote. Continue?") == true
    ) {
      e.preventDefault();
      $(".loading").show();
      $.ajax({
        url: `/quote/${$quoteId}/edit`,
        type: "get",
        success: function (data) {
          //$('#status').html('<div class="nNote nInformation hideit"><p><strong>INFORMATION: </strong>You Need submit again after edit</p></div>');
          location.reload();
        },
      });
      $(".loading").hide();
    } else {
      e.preventDefault();
    }
  });

  /* ------------------------- MORE GLOBAL VARIABLES ---------------------------- */

  const params = new URLSearchParams(window.location.search);
  const dialogToOpen = params.get("open");

  if (dialogToOpen === "make-quote") {
    $dialogMakeQuote.dialog("open");
  }

  function showFlashMessage(message, type = "success") {
    const flash = document.createElement("div");
    flash.className = `flash-message widget-table ${type}`;
    flash.innerHTML = `<p>${message}</p>`;

    document.getElementById("js-flash-container").appendChild(flash);

    // Force reflow to allow animation
    void flash.offsetWidth;

    flash.classList.add("show");

    setTimeout(() => {
      flash.style.opacity = "0";
      flash.style.transform = "translateY(-10px)";
      setTimeout(() => flash.remove(), 500); // match fade-out duration
    }, 4000);
  }

  const flash = document.querySelector(".flash-message");
  if (flash) {
    setTimeout(() => {
      flash.classList.add("show");
    }, 300);

    // Flash message auto-hide
    setTimeout(() => {
      if (flash) {
        flash.style.opacity = "0";
        flash.style.transform = "translateY(-10px)";
        setTimeout(() => flash.remove(), 500); // remove after animation
      }
    }, 4000);
  }
});
