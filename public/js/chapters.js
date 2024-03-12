var toastMixin = Swal.mixin({
  toast: true,
  icon: "success",
  title: "General Title",
  animation: false,
  position: "bottom-left",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

$("#createChapterForm").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const chapterTitle = $("#chapterTitle").val();
  const courseId = $("#courseId").val();

  if (!chapterTitle) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Категория обязателена!",
    });
    return false;
  }

  $("#chapters").empty();

  $.ajax({
    url: `/admin-create-chapter`,
    type: "POST",
    data: {
      chapterTitle: chapterTitle,
      id: courseId,
    },
    success: function (data) {
      const chapters = JSON.parse(data);
      toastMixin.fire({
        animation: true,
        title: "Глава успешно создана",
      });

      console.log(chapters);
      for (info of chapters) {
        $("#chapters").append(`
        <div class="flex justify-between border border-slate-300 rounded-md p-2 border-dashed bg-slate-100 mb-3">
            <div>${info.title}</div>
            <a href="/admin-edit-chapter/${courseId}/${info.id}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">edit</a>
        </div>
        `);
      }
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$("#formDescription").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const chapterDescription = $("#chapterDescription").val();
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();

  if (!chapterDescription) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Описание обязателен!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "PUT",
    data: {
      description: chapterDescription,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Описание успешно изменен",
      });
      $("#chapterDescription").val(data.description);
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$("#formTitle").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const chapterTitle = $("#chapterTitle").val();
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();

  if (!chapterTitle) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Описание обязателен!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "PUT",
    data: {
      title: chapterTitle,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Название успешно изменен",
      });
      $("#chapterTitle").val(data.title);
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$("#formVideo").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const chapterVideo = $("#chapterVideo").val();
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();

  if (!chapterVideo) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Описание обязателен!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "PUT",
    data: {
      videoUrl: chapterVideo,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Видео успешно изменен",
      });
      $("#chapterVideo").val(data.videoUrl);
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$('input[name="isPublished"]').on("change", function () {
  $(".button").prop("disabled", true);
  const isPublished = $(this).prop("checked");
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();

  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "PUT",
    data: {
      isPublished: isPublished,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Статус успешно изменен",
      });
      $("#isPublishedName").html(data.isPublished ? "true" : "false");
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$("#attachmentForm").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const fd = new FormData(this);
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();
  fd.append("courseId", courseId);
  fd.append("chapterId", chapterId);
  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "PUT",
    data: fd, // Don't wrap FormData object again
    processData: false, // Don't process data
    contentType: false, // Don't set content type
    success: function (data) {
      const attachments = data.attachment;
      $("#attachments").empty();
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Изображение успешно изменен",
      });
      $("#attachmentForm img").val("");

      for (info of attachments) {
        $("#attachments").append(`
        <div class="flex justify-between border border-slate-300 rounded-md p-2 border-dashed bg-slate-100 mb-3">
            <div>${info.name}</div>
            <div>
              <a href="/${info.url}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">download</a>
              <a id="${info.id}" class="deleteAttachment font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">delete</a>
            </div>
        </div>
        `);
      }
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});

$("body").on("click", ".deleteAttachment", function () {
  const courseId = $("#courseId").val();
  const chapterId = $("#chapterId").val();
  const id = $(this).attr("id");
  $.ajax({
    url: `/admin-edit-chapter/${courseId}/${chapterId}`,
    type: "DELETE",
    data: {
      id: id,
    },
    success: function (data) {
      const attachments = data.attachment;
      $("#attachments").empty();
      for (info of attachments) {
        $("#attachments").append(`
        <div class="flex justify-between border border-slate-300 rounded-md p-2 border-dashed bg-slate-100 mb-3">
            <div>${info.name}</div>
            <div>
              <a href="/${info.url}" class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">download</a>
              <a id="${info.id}" class="deleteAttachment font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">delete</a>
            </div>
        </div>
        `);
      }
      toastMixin.fire({
        animation: true,
        title: "Файл успешно удален",
      });
    },
    error: function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      toastMixin.fire({
        animation: true,
        icon: "error",
        title: response.err,
      });
    },
  });
});
