import Header from "../../common/Header";
import Footer from "../../common/Footer";
import Guardian from "../../compnents/create/Guardian";
import ContractEditor from "../../compnents/create/ContractEditor";
import { useEffect, useState } from "react";
import Payment from "../../compnents/create/Payment";
import Student from "../../compnents/create/StudentInfo";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3030";
  const API_URL2 = process.env.REACT_APP_API_URL;
export default function Create() {
  const navigate = useNavigate();
  // Define the initial state for `guardian`
  const [guardian, setGuardian] = useState(
    () =>
      loadFromLocalStorage("guardian") || {
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
      }
  );

  // Define the state for `contractEditor`
  const [contractEditor, setContractEditor] = useState(
    () =>
      loadFromLocalStorage("contractEditor") || {
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
      }
  );

  // Define the initial state for `student`
  const [student, setStudent] = useState(
    () =>
      loadFromLocalStorage("student") || {
        name: "",
        nationality: "",
        birthPlace: "",
        birthDate: "",
        idNumber: "",
        idIssueDate: "",
        idIssuePlace: "",
        previouslyEnrolled: null,
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
      }
  );

  // Define the initial state for `payment`
  const [payment, setPayment] = useState(
    () =>
      loadFromLocalStorage("payment") || {
        paymentType: "", // Default value
        transportation: {
          required: false, // Default value
          neighborhood: "",
          path: "", // Default value
        },
      }
  );

  // Automatically save data when there's a change
  useEffect(() => {
    saveToLocalStorage("guardian", guardian);
  }, [guardian]);

  useEffect(() => {
    saveToLocalStorage("contractEditor", contractEditor);
  }, [contractEditor]);

  useEffect(() => {
    saveToLocalStorage("student", student);
  }, [student]);

  useEffect(() => {
    saveToLocalStorage("payment", payment);
  }, [payment]);

  return (
    <>
      <Header />
      <div dir="rtl" className="container mt-2">
        <h2 className="fw-bold">عقد تسجيل طالب</h2>
        <hr />

        <form onSubmit={handleSubmit} noValidate>
          <Guardian data={guardian} setData={setGuardian} />
          <hr />
          <ContractEditor data={contractEditor} setData={setContractEditor} />
          <hr />
          <Student data={student} setData={setStudent} />
          <hr />
          <Payment data={payment} setData={setPayment} />
          <div className="text-center w-100">
            <button type="submit" className="btn btn-success w-75 text-center">
              حفظ العقد
            </button>
          </div>
        </form>
        <div className="text-center mt-3 w-100">
          <button
            onClick={clearAllFields}
            className="btn btn-danger w-75 text-center"
          >
            حذف الكل
          </button>
        </div>
      </div>
      <Footer />
    </>
  );

  // Save data to localStorage
  function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Load data from localStorage
  function loadFromLocalStorage(key) {
    const savedData = localStorage.getItem(key);
    return savedData ? JSON.parse(savedData) : null;
  }

  function validateRequiredFields() {
    const requiredFields = document.querySelectorAll("[required]");
    console.log(requiredFields);
    for (let field of requiredFields) {
      if (!field.value || field.value.trim() === "") {
        const label = field
          .closest(".form-group")
          ?.querySelector("label")?.innerText;

        alert(`يرجى ملء الحقل المطلوب: ${label || "حقل غير معروف"}`);

        field.focus(); // Focus on the missing field
        return false; // Stop checking after the first error
      }
    }

    return true; // All fields are filled
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateRequiredFields()) {
      return; // Stop submission if validation fails
    }

    const requestData = {
      guardian,
      contractEditor,
      student,
      payment,
    };

    fetch(`${API_URL2}/api/user/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("تم حفظ العقد بنجاح!");
          console.log("THI IS THE ID OF THE CONTRACT ADDED: ", data.data._id);

          // Clear localStorage
          localStorage.removeItem("guardian");
          localStorage.removeItem("contractEditor");
          localStorage.removeItem("student");
          localStorage.removeItem("payment");

          navigate(`/`);

          // (UNCOMMENT) EDIT HERE TO ENABLE THE NEW FEATURE (WHATSAPP AND EMAIL SNED)
          // navigate(`/sendcontract/${student.idNumber}`, {
          //   state: {
          //     contractEditorName: contractEditor.name,
          //     studentIdNumber: student.idNumber,
          //     contractId: data.data._id,
          //   },
          // });

          clearAllFields();
        } else {
          alert("حدث خطأ أثناء حفظ العقد. حاول مرة أخرى.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("تعذر الاتصال بالخادم.");
      });
  }
  function clearAllFields() {
    setGuardian({
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
    setContractEditor({
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
    setStudent({
      name: "",
      nationality: "",
      birthPlace: "",
      birthDate: "",
      idNumber: "",
      idIssueDate: "",
      idIssuePlace: "",
      previouslyEnrolled: false,
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
    setPayment({
      paymentType: "", // Default value
      transportation: {
        required: false, // Default value
        neighborhood: "",
        path: "", // Default value
      },
    });
    localStorage.clear();
  }
}
