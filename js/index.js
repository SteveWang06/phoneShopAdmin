/**
 * Project: Student Management (CRUD)
 * Features:
 *  + Create student
 *  + Read students
 *  + Delete student
 *  + Search student (id + name)
 *  + Update student
 *  + Validate form
 *  + call API
 * Start project
 *  + (PM BA PO) write product requirements document (PRD)
 *  + design
 *  + phân rã lớp đối tượng
 *    (1 lớp SinhVien: maSV, tenSV, price, desc, khoá học, điểm toán, lý,hoá , tinhDiemTrungBinh)
 *  + UI => implement js
 *  + Testing (QC)
 *  + production
 */

var studentList = [];

function createStudent() {
  var isFormValid = validateForm();

  if (!isFormValid) return;

  // 1.lấy input
  var id = document.getElementById("txtMa").value;
  var name = document.getElementById("txtTen").value;
  var price = document.getElementById("txtPrice").value;
  var desc = document.getElementById("txtDesc").value;
  var screen = document.getElementById("txtScreen").value;
  var type = document.getElementById("type").value;
  var frontCamera = document.getElementById("txtFront").value;
  var backCamera = document.getElementById("txtBack").value;
  var image = document.getElementById("img").value;

  // 3. tạo object sinh viên mới (input)
  var newStudent = new Student(
    id,
    name,
    price,
    desc,
    screen,
    type,
    frontCamera,
    backCamera,
    image
  );

  // gửi request xuống backend kèm theo đối tượng sinh viên mới => thêm sinh viên
  // request = header + body (data)
  axios({
    url: "https://634235dc20f1f9d7997ef83f.mockapi.io/api/phone",
    method: "POST",
    data: newStudent,
  })
    .then(function (res) {
      getStudentList();
      document.getElementById("btnReset").click();

    })
    .catch(function (err) {
      console.log(err);
    });

  
}

function validateForm() {
  // kiểm tra form
  var name = document.getElementById("txtTen").value;
  var price = document.getElementById("txtPrice").value;
  var desc = document.getElementById("txtDesc").value;
  var linkAnh = document.getElementById("img").value;
  var screen = document.getElementById("txtScreen").value;
  var type = document.getElementById("type").value;
  var frontCamera = document.getElementById("txtFront").value;
  var backCamera = document.getElementById("txtBack").value;

  var isValid = true;

  isValid &= required(name, "spanTenSV") && checkString(name, "spanTenSV");
  isValid &= required(price, "spanPrice") && checkPrice(price, "spanPrice")
  isValid &= required(desc, "desc");
  isValid &= required(linkAnh, "spanAnh");
  isValid &= required(screen, "spanScreen")&& checkString(screen, "spanScreen");
  isValid &= required(type, "spanType") && checkString(type, "spanType");
  isValid &= required(frontCamera, "spanFcam");
  isValid &= required(backCamera, "spanBcam");
  return isValid;
  // nếu isValid = true => form oke
  // nếu isValid = false => form error
}

function renderStudents(data) {
  if (!data) data = studentList;

  var tableHTML = "";
  for (var i = 0; i < data.length; i++) {
    var currentStudent = data[i];
    tableHTML += `<tr>
                <td>${currentStudent.id}</td>
                <td>${currentStudent.name}</td>
                <td>${currentStudent.price}</td>
                <td>${currentStudent.desc}</td>
                <td>${currentStudent.screen}</td>
                <td>${currentStudent.type}</td>
                <td>${currentStudent.frontCamera}</td>
                <td>${currentStudent.backCamera}</td>
                <td><image src="${currentStudent.image}"</image></td>
                <td>
                  <button onclick="deleteStudent('${
                    currentStudent.id
                  }')" class="btn btn-danger">Xoá</button>

                  <button onclick="getUpdateStudent('${
                    currentStudent.id
                  }')" class="btn btn-info">Sửa</button>
                </td>
                
              </tr>`;
  }
  document.getElementById("tbodySinhVien").innerHTML = tableHTML;
}

function deleteStudent(id) {
  axios({
    url:
      "https://634235dc20f1f9d7997ef83f.mockapi.io/api/phone/" + id,
    method: "DELETE",
  })
    .then(function (res) {
      console.log(res);
      getStudentList();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function findById(id) {
  for (var i = 0; i < studentList.length; i++) {
    console.log(studentList[i]);
    if (studentList[i].id === id) {
      return i;
    }
  }

  return -1;
}

function setStudentList() {
  var studentListJSON = JSON.stringify(studentList);
  localStorage.setItem("SL", studentListJSON);
}

function getStudentList() {
  // gửi request xuống backend => ds sinh viên
  var promise = axios({
    url: "https://634235dc20f1f9d7997ef83f.mockapi.io/api/phone",
    method: "GET",
  });

  promise
    .then(function (response) {
      studentList = mapData(response.data);
      renderStudents();
    })
    .catch(function (err) {
      console.log(err);
    });

  /**
   *  Promise:
   *    - Pending
   *    - Fulfill
   *    - Reject
   */
}

// input: list local => output: list mới
function mapData(studentListLocal) {
  var result = [];
  for (var i = 0; i < studentListLocal.length; i++) {
    var oldStudent = studentListLocal[i];
    var newStudent = new Student(
      oldStudent.id,
      oldStudent.name,
      oldStudent.price,
      oldStudent.desc,
      oldStudent.screen,
      oldStudent.type,
      oldStudent.frontCamera,
      oldStudent.backCamera,
      oldStudent.image
    );
    result.push(newStudent);
  }
  return result;
}

function searchStudents() {
  // document.getElementsByClassName("form-control")  trả về array
  // document.querySelectorAll(".form-control"); trả về array
  // document.getElementById("")

  var keyword = document.querySelector("#txtSearch").value.toLowerCase().trim();

  var result = [];

  for (var i = 0; i < studentList.length; i++) {
    var id = studentList[i].id;
    var studentName = studentList[i].name.toLowerCase();

    if (id === keyword || studentName.includes(keyword)) {
      result.push(studentList[i]);
    }
  }

  // result = [student1, student2,...]

  renderStudents(result);
}

window.onload = function () {
  // code sẽ chạy khi window đc load lên
  console.log("window load");
  document.getElementById("colMa").style.display = "none";

  getStudentList();
};

// update phần 1: lấy thông sinh viên show lên trên form
function getUpdateStudent(id) {
  axios({
    url:
      "https://634235dc20f1f9d7997ef83f.mockapi.io/api/phone/" + id,
    method: "GET",
  })
    .then(function (res) {
      document.getElementById("colMa").style.display = "block";

      var student = res.data;
      // đổ thông tin của student lên input
      document.getElementById("txtMa").value = student.id;
      document.getElementById("txtTen").value = student.name;
      document.getElementById("txtDesc").value = student.desc;
      document.getElementById("txtPrice").value = student.price;
      document.getElementById("txtScreen").value = student.screen;
      document.getElementById("type").value = student.type;
      document.getElementById("txtFront").value = student.frontCamera;
      document.getElementById("txtBack").value = student.backCamera;
      document.getElementById("img").value = student.image;

      // hiện nút lưu thay đổi, ẩn nút thêm
      document.getElementById("btnUpdate").style.display = "inline-block";
      document.getElementById("btnCreate").style.display = "none";

      // disable input mã sinh viên
      document.getElementById("txtMa").disabled = true;
    })
    .catch(function (err) {
      console.log(err);
    });
    console.log(id);
}

// update phần 2:  cho người dùng sửa thông tin trên form => nhấn nút lưu thay đổi => chạy hàm update
function updateStudent() {
  var id = document.getElementById("txtMa").value;
  var name = document.getElementById("txtTen").value;
  var desc = document.getElementById("txtDesc").value;
  var price = document.getElementById("txtPrice").value;
  var screen = document.getElementById("txtScreen").value;
  var type = document.getElementById("type").value;
  var frontCamera = document.getElementById("txtFront").value;
  var backCamera = document.getElementById("txtBack").value;
  var image = document.getElementById("img").value;

  // tạo đối tượng mới
  var newStudent = {id: id, name: name, desc: desc, price: price, screen: screen, type: type, frontCamera: frontCamera, backCamera: backCamera, image: image };

  axios({
    url:
      "https://634235dc20f1f9d7997ef83f.mockapi.io/api/phone/" + id,
    method: "PUT",
    data: newStudent,
  })
    .then(function (res) {
      var isFormValid = validateForm();
      if (!isFormValid) return;
      getStudentList();

      // hiện lại nút thêm, ẩn nút lưu
      document.getElementById("btnUpdate").style.display = "none";
      document.getElementById("btnCreate").style.display = "block";

      // clear toàn bộ input
      document.getElementById("btnReset").click();

      // mở lại input mã sinh viên
      document.getElementById("txtMa").disabled = false;
    })
    .catch(function (err) {
      console.log(err);
    });
}


// // required
function required(val, spanId) {
  if (val.length === 0) {
    document.getElementById(spanId).innerHTML = "*Trường này bắt buộc nhập";
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// // min length ,max length
function length(val, spanId, min, max) {
  if (val.length < min || val.length > max) {
    document.getElementById(
      spanId
    ).innerHTML = `*Độ dài phải từ ${min} tới ${max} kí tự`;
    return false;
  }

  document.getElementById(spanId).innerHTML = "";
  return true;
}

// // pattern check name
function checkString(val, spanId) {
  var pattern = /^[0-9a-zA-Z ]+$/;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = `*Chỉ chấp nhận số và chữ `;
  return false;
}

function checkPrice(val, spanId) {
  var pattern = /^[0-9]+$/;
  if (pattern.test(val)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }

  document.getElementById(spanId).innerHTML = `*Chỉ chấp nhận số`;
  return false;
}
function resetSpan(){
  document.getElementById('spanTenSV').innerHTML = "";
  document.getElementById('spanPrice').innerHTML = "";
  document.getElementById('desc').innerHTML = "";
  document.getElementById('spanAnh').innerHTML = "";
  document.getElementById('spanScreen').innerHTML = "";
  document.getElementById('spanType').innerHTML = "";
  document.getElementById('spanFcam').innerHTML = "";
  document.getElementById('spanBcam').innerHTML = "";
  return;
}



// pattern check desc

// pattern check number

// synchronous: đồng bộ
// var a = 5;
// var b = 10;
// var sum = a + b;
// console.log("tổng");
// console.log(sum);

// asynchronous : bất đồng bộ
// callback: function a truyền vào function b   đầu vào

// setTimeout(function () {
//   console.log("hello");
// }, 2000);

// setTimeout(function () {
//   console.log("hello 2");
// }, 3000);

// setTimeout(function () {
//   console.log("hello 4");
// }, 0);

// console.log("hello 5");
// console.log("hello 6");
// console.log("hello 7");

// setTimeout(function () {
//   console.log("hello 8");
// }, 1000);

// // for(var i = 0; i < 10000000000000000000000000000000; i++){
// //   console.log('hqweqwi')
// // }

// function test() {
//   console.log("a");
// }

// function test2() {
//   console.log("b");
// }

// function test3() {
//   console.log("c");

//   function test4() {
//     console.log("d");

//     function test5() {
//       console.log("e");
//     }
//     test5();
//   }

//   test4();
// }

// test();
// test2();
// test3();
