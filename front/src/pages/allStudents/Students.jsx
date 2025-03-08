import React, { useState, useEffect } from "react";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import { useNavigate } from "react-router-dom";

const API_URL2 = process.env.REACT_APP_API_URL;
const Students = () => {
  // State for search query, selected column, and table data
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("guardianName");
  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch(`${API_URL2}/api/admin/ViewContarcts`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const formattedData = data.data.map((contract) => ({
            _id: contract._id, // Add contract ID
            guardianName: contract.guardian.name,
            guardianId: contract.guardian.idNumber,
            relationship: contract.guardian.relationship,
            registeredPhone: contract.guardian.absherMobileNumber,
            otherPhone: contract.guardian.additionalMobileNumber,
            address: contract.guardian.residentialAddress,
            contractEditor: contract.contractEditor.name,
            editorId: contract.contractEditor.idNumber,
            studentName: contract.student.name,
            studentId: contract.student.idNumber,
          }));
          setTableData(formattedData);
        }
      })
      .catch((error) => console.error("Error fetching contract data:", error));
  }, []);

  // Filter data based on search query and selected column
  const filteredData = tableData.filter((item) =>
    String(item[selectedColumn])
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const handleEdit = (id) => {
    navigate(`/edit-contract/${id}`); // Redirect to edit page with contract ID
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا العقد؟")) {
      try {
        const response = await fetch(`${API_URL2}/api/admin/delete/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setTableData(tableData.filter((contract) => contract._id !== id)); // Remove from table
          alert("تم حذف العقد بنجاح!");
        } else {
          alert("فشل حذف العقد.");
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("خطأ في الاتصال بالخادم.");
      }
    }
  };

  const handlePrint = async (id) => {
    try {
      console.log("Downloading contract for student ID:", id);

      const response = await fetch(`${API_URL2}/api/admin/print/${id}`, {
        method: "GET",
      });
      console.log("Received response from server:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error message:", errorData.message);
        throw new Error(errorData.message);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      console.log("Blob created with size:", blob.size);

      const link = document.createElement("a");
      link.href = url;
      link.download = `contract-${id}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading contract:", error);
      alert(`Failed to download the contract. Error: ${error.message}`);
    }
  };

  return (
    <>
      <Header />

      <div dir="rtl" className="container mt-5">
        {/* Header */}
        <h1 className="text-center mb-4">قائمة عقود التسجيل للطلاب</h1>

        {/* Create New Contract Button */}
        <button
          className="btn mb-4 btn-primary"
          onClick={() => navigate("/create")}
        >
          + انشاء جديد
        </button>

        {/* Search Field */}
        <div className="d-flex mb-4 gap-1 justify-content-start">
          <input
            type="text"
            className="form-control w-50"
            placeholder="ابحث في الجدول"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="form-control w-25"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="guardianName">اسم ولى الامر</option>
            <option value="guardianId">رقم الهوية/الاقامة (ولى الامر)</option>
            <option value="relationship">صله القرابة</option>
            <option value="registeredPhone">رقم الجوال المسجل فـي أبشر</option>
            <option value="otherPhone">رقم جوال اخر</option>
            <option value="address">العنوان</option>
            <option value="contractEditor">اسم محرر العقد</option>
            <option value="editorId">رقم هويه/الاقامه لمحرر العقد</option>
            <option value="studentName">اسم الطالب</option>
            <option value="studentId">رقم هويه/الاقامة للطالب</option>
          </select>
        </div>

        {/* Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>اسم ولى الامر</th>
              <th>رقم الهوية/الاقامة (ولى الامر)</th>
              <th>صله القرابة</th>
              <th>رقم الجوال المسجل فـي أبشر</th>
              <th>رقم جوال اخر</th>
              <th>العنوان</th>
              <th>اسم محرر العقد</th>
              <th>رقم هويه/الاقامه لمحرر العقد</th>
              <th>اسم الطالب</th>
              <th>رقم هويه/الاقامة للطالب</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((student, index) => (
                <tr key={index}>
                  <td>{student.guardianName}</td>
                  <td>{student.guardianId}</td>
                  <td>{student.relationship}</td>
                  <td>{student.registeredPhone}</td>
                  <td>{student.otherPhone}</td>
                  <td>{student.address}</td>
                  <td>{student.contractEditor}</td>
                  <td>{student.editorId}</td>
                  <td>{student.studentName}</td>
                  <td>{student.studentId}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(student._id)}
                      className="btn btn-warning "
                      style={{
                        // padding: "2px 5px",
                        fontSize: "10px",
                        width: "90px",
                        margin: "1px",

                        height: "20px",
                        lineHeight: "1",
                      }}
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="btn btn-danger  ms-1"
                      style={{
                        margin: "1px",
                        width: "90px",
                        height: "20px",
                        fontSize: "10px",
                        lineHeight: "1",
                      }}
                    >
                      حذف
                    </button>
                    <button
                      onClick={() => handlePrint(student._id)}
                      className="btn btn-primary  ms-1"
                      style={{
                        margin: "1px",
                        width: "90px",
                        height: "20px",
                        fontSize: "10px",
                        lineHeight: "1",
                      }}
                    >
                      طباعة
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  لا توجد بيانات مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default Students;
