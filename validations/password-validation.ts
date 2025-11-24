import * as Yup from "yup";

export const passwordSchema = Yup.object().shape({
    password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(1, "Ingresa la contraseña"),
});

export interface PasswordFormValues {
    password: string;
}