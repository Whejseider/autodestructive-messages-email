import * as Yup from "yup";

export const messageSchema = Yup.object().shape({
    title: Yup.string()
        .required("Complete este campo")
        .max(50, "El título no puede tener más de 50 caracteres"),

    message: Yup.string()
        .required("El mensaje es obligatorio")
        .min(1, "El mensaje debe tener al menos 1 carácter")
        .max(256, "El mensaje no puede tener más de 256 caracteres"),

    password: Yup.string()
        .transform((value) => (value === "" ? undefined : value))
        .notRequired()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .max(40, "La contraseña no puede tener más de 40 caracteres"),
});

export interface FormValues {
    title: string;
    message: string;
    password?: string;
}