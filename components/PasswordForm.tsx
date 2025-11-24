"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import {Eye, EyeOff, ShieldCheck, Shredder} from "lucide-react";
import {PasswordFormValues, passwordSchema} from "@/validations/password-validation";

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
            <Card className="max-w-md">
                <CardHeader className="flex gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                        <ShieldCheck className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-xl font-bold">{message.title}</p>
                        <p className="text-small text-default-500">Mensaje secreto</p>
                    </div>
                </CardHeader>
                <Divider />
                <CardBody className="py-6">
                    <p className="text-lg whitespace-pre-wrap">{message.content}</p>
                </CardBody>
                <Divider />
                <CardFooter className="bg-danger/5">
                    <div className="flex items-center gap-2 text-danger">
                        <Shredder className="w-5 h-5" />
                        <p className="text-sm font-medium">
                            Este mensaje se ha autodestruido y no puede ser recuperado
                        </p>
                    </div>
                </CardFooter>
            </Card>
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
                                variant="flat"
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