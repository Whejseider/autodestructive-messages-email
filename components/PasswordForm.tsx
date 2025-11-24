"use client";

import {useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {Eye, EyeOff} from "lucide-react";
import {PasswordFormValues, passwordSchema} from "@/validations/password-validation";
import {MessageCard} from "@/components/MessageCard";

export default function PasswordForm({ id }: { id: string }) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState<{ title: string; content: string } | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const initialValues: PasswordFormValues = {
        password: "",
    };

    const handleSubmit = async (
        values: PasswordFormValues,
        { setSubmitting }: FormikHelpers<PasswordFormValues>
    ) => {
        setError("");

        try {
            const res = await fetch(`/api/message/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: values.password }),
            });

            if (res.status === 401) {
                setError("Contraseña incorrecta");
                setSubmitting(false);
                return;
            }

            if (!res.ok) {
                setError("Error al obtener el mensaje");
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            setMessage(data);
        } catch {
            setError("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    if (message) {
        return (
            <MessageCard message={message}/>
        );
    }

    return (
        <Formik<PasswordFormValues>
            initialValues={initialValues}
            validationSchema={passwordSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting, errors, touched, submitForm }) => (
                <Form className="w-full flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-danger/10 border border-danger text-danger rounded-medium text-sm">
                            {error}
                        </div>
                    )}

                    <Field name="password">
                        {({ field }: any) => (
                            <Input
                                {...field}
                                type={isVisible ? "text" : "password"}
                                label="Contraseña"
                                placeholder="Ingresa la contraseña"
                                variant="bordered"
                                labelPlacement="outside"
                                isRequired
                                isInvalid={!!(touched.password && errors.password)}
                                errorMessage={touched.password && errors.password}
                                endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none cursor-pointer"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeOff className="w-5 h-5 text-default-400 pointer-events-none" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-default-400 pointer-events-none" />
                                        )}
                                    </button>
                                }
                            />
                        )}
                    </Field>

                    <Button
                        type="button"
                        onPress={submitForm}
                        isDisabled={isSubmitting}
                        isLoading={isSubmitting}
                        color="primary"
                        variant="shadow"
                        size="lg"
                        className="font-semibold"
                        fullWidth
                    >
                        Ver mensaje
                    </Button>
                </Form>
            )}
        </Formik>
    );
}