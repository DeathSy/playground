export function InsuranceMock() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const encodedUri = encodeURI(`df2f://conversation?appNo=${e.target["app-no"].value}&clientType=${e.target["client-type"].value}&agentCode=${e.target["agent-code"].value}&licenseNo=${e.target["license-no"].value}&phoneNo=${e.target["mobile-number"].value}&polType=${e.target["policy-type"].value}&voice1=${e.target["voice-1"].value}&voice2=${e.target["voice-2"].value}&companyName=philiph-life`);
    window.location.href = encodedUri
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
        <div className="form-control">
          <label className="label" htmlFor="voice-1">
            Voice 1
          </label>
          <textarea type="text" className="form-input" id="voice-1" />
        </div>
        <div className="form-control">
          <label className="label" htmlFor="voice-2">
            Voice 2
          </label>
          <textarea type="text" className="form-input" id="voice-2" />
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
