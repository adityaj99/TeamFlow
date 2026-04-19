const dateFormat = (isoString) => {
  const date = new Date(isoString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

  return formattedDate;
};

export default dateFormat;
