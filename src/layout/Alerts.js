import Swal from "sweetalert2";

export function showAlertSuccess(title, text) {
  Swal.fire({
    icon: "success",
    title: title,
    text: text,
  });
}

export function showAlertError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    // footer: '<a href="">Why do I have this issue?</a>'
  });
}
