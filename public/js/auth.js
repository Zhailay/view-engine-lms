$("#register").submit(function (e) {
  e.preventDefault();
  $(this).prop("disabled", true);
  const email = $("#email").val();
  const name = $("#name").val();
  const password = $("#password").val();
  $.post("/register", {
    email: email,
    name: name,
    password: password,
  })
    .done(function (data) {
      window.location.href =
        "/confirm?id=" + data.id + "&email=" + encodeURIComponent(email);
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

$("#login").submit(function (e) {
  e.preventDefault();
  console.log("asd");
  $(this).prop("disabled", true);
  const email = $("#email").val();
  const password = $("#password").val();
  $.post("/login", {
    email: email,
    password: password,
  })
    .done(function (data) {
      // console.log(data);
      window.location.href = "/dashboard";
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
