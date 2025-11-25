import * as Yup from "yup";

export const emailSchema = Yup.object().shape({
    email: Yup.string()
        .email("Ingresa un correo válido")
        .required("El correo es obligatorio")
        .lowercase()
        .trim()
        .matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Ingresa un correo válido"
        ),
});

export interface EmailFormValues {
    email: string;
}

