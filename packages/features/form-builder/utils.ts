export const preprocessNameFieldDataWithVariant = (
  variantName: "fullName" | "firstAndLastName",
  value: string | Record<"firstName" | "lastName", string> | undefined
) => {
  // We expect an object here, but if we get a string, then we will try to transform it into the appropriate object
  if (variantName === "firstAndLastName") {
    return getFirstAndLastName(value);
    // We expect a string here, but if we get an object, then we will try to transform it into the appropriate string
  } else {
    return getFullName(value);
  }
};

export const getFullName = (name: string | { firstName: string; lastName?: string } | undefined) => {
  if (!name) {
    return "";
  }
  let nameString = "";
  if (typeof name === "string") {
    nameString = name;
  } else {
    nameString = name.firstName;
    if (name.lastName) {
      nameString = `${nameString} ${name.lastName}`;
    }
  }
  return nameString;
};

function getFirstAndLastName(value: string | Record<"firstName" | "lastName", string> | undefined) {
  let newValue: Record<"firstName" | "lastName", string>;
  value = value || "";
  if (typeof value === "string") {
    try {
      // Support name={"firstName": "John", "lastName": "Johny Janardan"} for prefilling
      newValue = JSON.parse(value);
    } catch (e) {
      // Support name="John Johny Janardan" to be filled as firstName="John" and lastName="Johny Janardan"
      const parts = value.split(" ").map((part) => part.trim());
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");

      // If the value is not a valid JSON, then we will just use the value as is as it can be the full name directly
      newValue = { firstName, lastName };
    }
  } else {
    newValue = value;
  }
  return newValue;
}
