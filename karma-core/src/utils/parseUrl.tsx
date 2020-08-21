const parseUrl = () => {
  switch (process.env.REACT_APP_ENVIRONMENT) {
    case "production":
      return {
        domain: "karmacareers.com",
        protocal: "https://"
      };
    case "local":
    case "localhost":
      return {
        domain: "localhost",
        protocal: "http://"
      };
    default:
      return {
        domain: "dev.karmacareers.com",
        protocal: "https://"
      };
  }
};

export default parseUrl;
