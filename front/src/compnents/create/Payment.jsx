export default function Payment({ data, setData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleTransportationChange = (e) => {
    const { name, value } = e.target;
    if (name === "required" && value === "false") {
      // If transportation is not required, clear the data for neighborhood and path
      setData({
        ...data,
        transportation: {
          required: false,
          neighborhood: "",
          path: "One path", // Default value
        },
      });
    } else {
      // Otherwise, keep the existing values for neighborhood and path
      setData({
        ...data,
        transportation: { ...data.transportation, [name]: value },
      });
    }
  };

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">آلية سداد الرسوم الدراسية</h5>
      <hr className="w-50" />

      {/* Payment Type Selection */}
      <div className="my-3">
        <div className="form-group w-100 mt-3">
          {/* <label>نوع السداد</label> */}
          <select
            name="paymentType"
            className="form-control"
            value={data.paymentType}
            onChange={handleChange}
            required
          >
            <option value="Annual">سداد سنوي</option>
            <option value="Quarterly">سداد فصلي</option>
          </select>
        </div>
        <h5 className="fw-bold mt-3">النقل المدرسي</h5>
        {/* Transportation Selection */}
        <div className="form-group w-45 mt-3">
          <label>هل ترغب بتسجيل الطالب ضمن النقل المدرسى للمدارس</label>
          <select
            name="required"
            className="form-control"
            value={data.transportation.required}
            onChange={handleTransportationChange}
            required
          >
            <option value="false">لا</option>
            <option value="true">نعم</option>
          </select>
        </div>
      </div>

      {/* Show these inputs only if transportation is required */}
      {data.transportation.required === "true" && (
        <div className="d-flex justify-content-between my-3">
          <div className="form-group w-45 mt-3">
            <label>الحى</label>
            <input
              type="text"
              name="neighborhood"
              className="form-control"
              value={data.transportation.neighborhood}
              onChange={handleTransportationChange}
              required
            />
          </div>

          <div className="form-group w-45 mt-3">
            <label>المسار</label>
            <select
              name="path"
              className="form-control"
              value={data.transportation.path}
              onChange={handleTransportationChange}
              required
            >
              <option value="One path">مسار واحد</option>
              <option value="Two paths">مسارين</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
