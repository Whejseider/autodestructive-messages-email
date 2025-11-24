"use client";

import {useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {FormValues, messageSchema} from "@/validations/message-validation";
import {Button} from "@heroui/button";
import {Input, Textarea} from "@heroui/input";
import {Chip} from "@heroui/chip";
import {Eye, EyeOff, Mail} from "lucide-react";

export default function MessageForm() {
    const [createdId, setCreatedId] = useState<string | null>(null);
    const [generalError, setGeneralError] = useState("");
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

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
                        <div
                            className="p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-500 rounded-lg">
                            {generalError}
                        </div>
                    )}

                    <h2 className="text-2xl font-bold">
                        Mensaje Autodestructivo
                    </h2>

                    <Field name="title">
                        {({field, form}: any) => (
                            <Input
                                {...field}
                                isClearable
                                onClear={() => form.setFieldValue('title', '')}
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
                        {({field, form}: any) => (
                            <Textarea
                                {...field}
                                isClearable
                                onClear={() => form.setFieldValue('message', '')}
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
                                startContent={
                                    <Mail className="text-2xl text-default-400 pointer-events-none shrink-0" />
                                }
                            />
                        )}
                    </Field>

                    <Field name="password">
                        {({field}: any) => (
                            <Input
                                {...field}
                                type={isVisible ? "text" : "password"}
                                label="Contraseña (opcional)"
                                placeholder="Para desencriptar"
                                variant="flat"
                                labelPlacement="outside"
                                isInvalid={!!(errors.password && touched.password)}
                                errorMessage={
                                    errors.password && touched.password ? errors.password : ""
                                }
                                endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-solid outline-transparent"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeOff className="text-2xl text-default-400 pointer-events-none"/>
                                        ) : (
                                            <Eye className="text-2xl text-default-400 pointer-events-none"/>
                                        )
                                        }
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
                        Crear mensaje
                    </Button>
                </Form>
            )}
        </Formik>
    );
}