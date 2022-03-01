export function InsuranceMock() {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = `df2f://conversation?appNo=${e.target["app-no"].value}&clientType=${e.target["client-type"].value}&agentCode=${e.target["agent-code"].value}$licenseNo=${e.target["license-no"]}&phoneNo=${e.target["mobile-number"].value}&polType=${e.target["policy-type"].value}&companyName=philiph-life`;
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label className="label" htmlFor="app-no">
            App No
          </label>
          <input type="text" className="form-input" id="app-no" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="client-type">
            Client Type
          </label>
          <input type="text" className="form-input" id="client-type" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="agent-code">
            Agent Code
          </label>
          <input type="text" className="form-input" id="agent-code" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="agent-code">
            License No
          </label>
          <input type="text" className="form-input" id="license-no" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="mobile-number">
            Mobile Number
          </label>
          <input type="text" className="form-input" id="mobile-number" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="policy-type">
            Policy Type
          </label>
          <input type="text" className="form-input" id="policy-type" />
        </div>
        <div className="form-control my-5">
          <button className="btn btn-primary btn-block" type="submit">
            Create DF2F application
          </button>
        </div>
      </form>
    </div>
  );
}
