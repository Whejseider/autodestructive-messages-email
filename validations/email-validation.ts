import * as Yup from "yup";

export const emailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Ingresa un correo válido")
        .required("El correo es obligatorio"),
});

export interface EmailFormValues {
    email: string;
}

