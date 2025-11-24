"use client";

import {useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {FormValues, messageSchema} from "@/validations/message-validation";
import {Button} from "@heroui/button";
import {Input, Textarea} from "@heroui/input";
import {Chip} from "@heroui/chip";

export default function MessageForm() {
    const [createdId, setCreatedId] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState("");
    const [copied, setCopied] = useState(false);

    const initialValues: FormValues = {
        title: "",
        message: "",
        password: "",
    };

    const handleSubmit = async (
        values: FormValues,
        {setSubmitting, resetForm}: FormikHelpers<FormValues>
    ) => {
        setGeneralError("");

        try {
            const res = await fetch("/api/message/post", {
                method: "POST",
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error(await res.text());
            }

            const data = await res.json();
            setCreatedId(data.id);
            resetForm();
        } catch (err: any) {
            setGeneralError(err.message || "Error creando el mensaje");
        } finally {
            setSubmitting(false);
        }
    };

    if (createdId) {
        const shareableUrl = `${
            typeof window !== "undefined" ? window.location.origin : ""
        }/message/${createdId}`;

        const handleCopy = () => {
            navigator.clipboard.writeText(shareableUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        };

        return (
            <div className="w-full max-w-xl space-y-4 text-center">
                <h2 className="text-2xl font-bold">¡Mensaje Creado!</h2>
                <p className="text-default-500">
                    Comparte este enlace. Solo podrá verse una vez.
                </p>

                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={shareableUrl}
                        readOnly
                        variant="flat"
                    />
                    <Button
                        onPress={handleCopy}
                        color="default"
                        variant="flat"
                    >
                        {copied ? "¡Copiado!" : "Copiar"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Formik<FormValues>
            initialValues={initialValues}
            validationSchema={messageSchema}
            onSubmit={handleSubmit}
        >
            {({isSubmitting, errors, touched, submitForm}) => (
                <Form className="w-full max-w-md flex flex-col gap-6">

                    {generalError && (
                        <div className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-500 rounded-lg">
                            {generalError}
                        </div>
                    )}

                    <h2 className="text-2xl font-bold">
                        Mensaje Autodestructivo
                    </h2>

                    <Field name="title">
                        {({field}: any) => (
                            <Input
                                {...field}
                                isRequired
                                type="text"
                                label="Título"
                                variant="flat"
                                labelPlacement="outside"
                                placeholder="Escribe el título del mensaje"
                                isInvalid={!!(touched.title && errors.title)}
                                errorMessage={touched.title && errors.title}
                            />
                        )}
                    </Field>

                    <Field name="message">
                        {({field}: any) => (
                            <Textarea
                                {...field}
                                isRequired
                                label="Mensaje"
                                placeholder="Escribe tu mensaje secreto..."
                                variant="flat"
                                labelPlacement="outside"
                                minRows={4}
                                isInvalid={!!(errors.message && touched.message)}
                                errorMessage={
                                    errors.message && touched.message ? errors.message : ""
                                }
                            />
                        )}
                    </Field>

                    <Field name="password">
                        {({field}: any) => (
                            <Input
                                {...field}
                                type="password"
                                label="Contraseña"
                                placeholder="Para desencriptar"
                                variant="flat"
                                labelPlacement="outside"
                                isInvalid={!!(errors.password && touched.password)}
                                errorMessage={
                                    errors.password && touched.password ? errors.password : ""
                                }
                                endContent={
                                    <Chip size="sm" variant="flat" color="default">
                                        Opcional
                                    </Chip>
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
                        Crear mensaje
                    </Button>
                </Form>
            )}
        </Formik>
    );
}