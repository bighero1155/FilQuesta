export interface UserFormData {
  username: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  age: string;
  address: string;
  contact_number: string;
  email: string;
  password: string;
  role: string;
  section?: string;
  school?: string;
}

export interface FieldErrors {
  [key: string]: string[];
}

export const validateUserForm = (
  formData: UserFormData,
  isEditing = false
): FieldErrors => {
  const errors: FieldErrors = {};

  if (!formData.username?.trim()) {
    errors.username = ["Username is required."];
  }

  if (!formData.first_name?.trim()) {
    errors.first_name = ["First name is required."];
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = ["Last name is required."];
  }

  if (!formData.age?.trim()) {
    errors.age = ["Age is required."];
  } else if (!/^\d+$/.test(formData.age)) {
    errors.age = ["Age must be a valid number."];
  }

  if (!formData.address?.trim()) {
    errors.address = ["Last name is required."];
  }

  if (!formData.contact_number?.trim()) {
    errors.contact_number = ["Contact number is required."];
  } else if (!/^\d{7,15}$/.test(formData.contact_number)) {
    errors.contact_number = ["Contact number must be 7–15 digits."];
  }

  if (!formData.email?.trim()) {
    errors.email = ["Email is required."];
  } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
    errors.email = ["Invalid email format."];
  }

  if (!isEditing) {
    if (!formData.password?.trim()) {
      errors.password = ["Password is required."];
    } else if (formData.password.length < 6) {
      errors.password = ["Password must be at least 6 characters."];
    }
  }

  if (!formData.role?.trim()) {
    errors.role = ["Role is required."];
  }

   if (!formData.section?.trim()) {
    errors.section = ["Last name is required."];
  }

   if (!formData.school?.trim()) {
    errors.school = ["Last name is required."];
  }

  return errors;
};

export const mergeErrors = (
  localErrors: FieldErrors,
  serverErrors?: { [key: string]: string[] }
): FieldErrors => {
  return { ...localErrors, ...(serverErrors || {}) };
};
