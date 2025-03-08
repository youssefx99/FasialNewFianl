import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Guardian from "../../compnents/create/Guardian";
import ContractEditor from "../../compnents/create/ContractEditor";
import { useState } from "react";
import Payment from "../../compnents/create/Payment";
import Student from "../../compnents/create/StudentInfo";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3030";
  const API_URL2 = process.env.REACT_APP_API_URL;
export default function EditContract() {
  // Define the initial state for `guardian`
  const [guardian, setGuardian] = useState({
    name: "",
    idNumber: "",
    relationship: "",
    absherMobileNumber: "",
    additionalMobileNumber: "",
    residentialAddress: "",
    profession: "",
    workAddress: "",
    workPhoneNumber: "",
    extension: "",
    contactPersons: [
      {
        name: "",
        relationship: "",
        mobileNumber: "",
      },
      {
        name: "",
        relationship: "",
        mobileNumber: "",
      },
    ],
  });

  // Define the state for `contractEditor`
  const [contractEditor, setContractEditor] = useState({
    name: "",
    idNumber: "",
    relationship: "",
    absherMobileNumber: "",
    additionalMobileNumber: "",
    residentialAddress: "",
    profession: "",
    workAddress: "",
    workPhoneNumber: "",
    extension: "",
  });

  // Define the initial state for `student`
  const [student, setStudent] = useState({
    name: "",
    nationality: "",
    birthPlace: "",
    birthDate: "",
    idNumber: "",
    idIssueDate: "",
    idIssuePlace: "",
    previouslyEnrolled: false,
    previousSchoolName: "",
    previousSchoolCity: "",
    previousSchoolType: "",
    requiredSchool: "",
    requiredStage: "",
    requiredGrade: "",
    hasSiblingsInIthraa: false,
    siblings: [
      {
        name: "",
        school: "",
        stage: "",
        grade: "",
      },
    ],
  });

  // Define the initial state for `payment`
  const [payment, setPayment] = useState({
    paymentType: "Annual", // Default value
    transportation: {
      required: false, // Default value
      neighborhood: "",
      path: "One path", // Default value
    },
  });
  const { id } = useParams(); // Get contract ID from URL
  const navigate = useNavigate(); // For redirection after editing
  useEffect(() => {
    fetch(`${API_URL2}/api/admin/get/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setGuardian(data.data.guardian);
          setContractEditor(data.data.contractEditor);
          const previouslyEnrolled =
            data.data.student.previouslyEnrolled === true ||
            data.data.student.previouslyEnrolled === "true";
          setStudent({
            ...data.data.student,
            previouslyEnrolled,
          });
          console.log(data.data.student);
          setPayment(data.data.payment);
        } else {
          alert("فشل تحميل بيانات العقد.");
        }
      })
      .catch((error) => console.error("Error fetching contract:", error));
  }, [id]);

  return (
    <>
      <Header />
      <div dir="rtl" className="container mt-2">
        <h2 className="fw-bold">عقد تسجيل طالب</h2>
        <hr />
        <Guardian data={guardian} setData={setGuardian} />
        <hr />
        <ContractEditor data={contractEditor} setData={setContractEditor} />
        <hr />
        <Student data={student} setData={setStudent} />
        <hr />
        <Payment data={payment} setData={setPayment} />
        <div className="text-center w-100">
          <button
            onClick={handleSubmit}
            className="btn btn-success w-75 text-center edit-button"
          >
            تعديل العقد
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
  function handleSubmit() {
    const requestData = {
      guardian,
      contractEditor,
      student,
      payment,
    };

    fetch(`${API_URL2}/api/admin/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("تم تعديل العقد بنجاح!");
          navigate("/students"); // Redirect back to the students list
        } else {
          alert("حدث خطأ أثناء تعديل العقد.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("تعذر الاتصال بالخادم.");
      });
  }
}
