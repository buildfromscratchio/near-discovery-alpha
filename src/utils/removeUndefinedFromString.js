function removeUndefinedFromString(str) {
  const undefinedString = "undefined - ";
  if (str?.startsWith(undefinedString)) {
    return str?.substring(undefinedString?.length);
  }
  return str || "";
}

export default removeUndefinedFromString;
