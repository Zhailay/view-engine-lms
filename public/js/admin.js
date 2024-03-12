var toastMixin = Swal.mixin({
  toast: true,
  icon: "success",
  title: "General Title",
  animation: false,
  position: "top-right",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

$("#courseTitle").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const courseTitle = $("#course-title").val();
  if (!courseTitle) {
    $("#errors").append(`
    <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-200 dark:bg-gray-800 dark:text-red-400" role="alert">
      <span class="font-medium">Ошибка!</span> Загаловок обязателен!
      </div>
    `);
  }
  $.post("/admin-create-title", {
    courseTitle: courseTitle,
  })
    .done(function (data) {
      console.log(data);
      window.location.href = `/admin-edit-course/${data.id}`;
    })
    .fail(function (xhr, status, error) {
      var response = JSON.parse(xhr.responseText);
      $("#errors").append(`
        <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-200 dark:bg-gray-800 dark:text-red-400" role="alert">
          <span class="font-medium">Ошибка!</span> ${response.err}
          </div>
        `);
    });
});

$("#formTitle").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const courseTitle = $("#courseTitle").val();
  const courseId = $("#courseId").val();

  if (!courseTitle) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Загаловок обязателен!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-course/${courseId}`,
    type: "PUT",
    data: {
      title: courseTitle,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Загаловок успешно изменен",
      });
      $("#courseTitle").val(data.title);
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
  const courseDescription = $("#courseDescription").val();
  const courseId = $("#courseId").val();

  if (!courseDescription) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Описание обязателен!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-course/${courseId}`,
    type: "PUT",
    data: {
      description: courseDescription,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Описание успешно изменен",
      });
      $("#courseDescription").val(data.description);
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

$('input[name="imageUrl"]').on("change", function () {
  $("#formCourseImageUrl").submit();
});

$("#formCourseImageUrl").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const fd = new FormData(this);
  const courseId = $("#courseId").val();
  fd.append("courseId", courseId);

  $.ajax({
    url: `/admin-edit-course/${courseId}`,
    type: "PUT",
    data: fd, // Don't wrap FormData object again
    processData: false, // Don't process data
    contentType: false, // Don't set content type
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Изображение успешно изменен",
      });
      $("#imageUrl").val("");
      $("#formCourseImageUrl img").attr("src", data.imageUrl);
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

$("#formCourseCategory").submit(function (e) {
  e.preventDefault();
  $(".button").prop("disabled", true);
  const courseCategory = $("#courseCategory").val();
  const courseId = $("#courseId").val();

  if (!courseCategory) {
    toastMixin.fire({
      animation: true,
      icon: "error",
      title: "Категория обязателена!",
    });
    return false;
  }

  $.ajax({
    url: `/admin-edit-course/${courseId}`,
    type: "PUT",
    data: {
      categoryId: courseCategory,
    },
    success: function (data) {
      console.log(data);
      toastMixin.fire({
        animation: true,
        title: "Категория успешно изменена",
      });
      $("#courseCategory").val(data.categoryId);
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
