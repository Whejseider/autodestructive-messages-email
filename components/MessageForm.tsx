"use client";

import {useState} from "react";
import {Field, Form, Formik, FormikHelpers} from "formik";
import {FormValues, messageSchema} from "@/validations/message-validation";
import {Button} from "@heroui/button";
import {Input, Textarea} from "@heroui/input";
import {Check, Copy, Eye, EyeOff, Mail, Send} from "lucide-react";
import {useDisclosure} from "@heroui/use-disclosure";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/modal";
import {EmailFormValues, emailSchema} from "@/validations/email-validation";

export default function MessageForm() {
    const [createdId, setCreatedId] = useState<string | null>(null);
    const [createdTitle, setCreatedTitle] = useState<string>("");
    const [generalError, setGeneralError] = useState("");
    const [copied, setCopied] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [shareStatus, setShareStatus] = useState<{ success: boolean; message: string } | null>(null);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const initialValues: FormValues = {
        title: "",
        content: "",
        password: "",
    };

    const emailInitialValues: EmailFormValues = {
        email: "",
    };

    const handleShareByEmail = async (
        values: EmailFormValues,
        {setSubmitting, resetForm}: FormikHelpers<EmailFormValues>
    ) => {
        if (!createdId) return;

        setShareStatus(null);

        try {
            const response = await fetch('/api/share', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    messageId: createdId,
                    email: values.email,
                    title: createdTitle
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setShareStatus({
                    success: true,
                    message: "¡Enlace enviado con éxito!"
                });
                resetForm();
                setTimeout(() => {
                    onClose();
                    setShareStatus(null);
                }, 2000);
            } else {
                throw new Error(result.error || 'Error al enviar el correo');
            }
        } catch (error: any) {
            setShareStatus({
                success: false,
                message: error.message || "Error al enviar el correo"
            });
        } finally {
            setSubmitting(false);
        }
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
            setCreatedTitle(values.title);
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

        const handleCloseModal = () => {
            onClose();
            setShareStatus(null);
        };

        return (
            <div className="w-full max-w-xl space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">¡Mensaje Creado!</h2>
                    <p className="text-default-500">
                        Comparte este enlace. Solo podrá verse una vez.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Input
                            type="text"
                            value={shareableUrl}
                            readOnly
                            variant="bordered"
                            classNames={{
                                inputWrapper: "flex-1"
                            }}
                        />
                        <Button
                            onPress={handleCopy}
                            variant="flat"
                            color={copied ? "success" : "default"}
                            isIconOnly
                            aria-label="Copiar enlace"
                        >
                            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                        </Button>
                    </div>

                    <Button
                        onPress={onOpen}
                        color="primary"
                        variant="flat"
                        startContent={<Mail className="w-4 h-4"/>}
                        fullWidth
                    >
                        Enviar por correo
                    </Button>
                </div>

                <Modal isOpen={isOpen} onClose={handleCloseModal} placement="center">
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold">Enviar por correo</h3>
                            <p className="text-sm text-default-500 font-normal">
                                Envía el enlace del mensaje a un destinatario
                            </p>
                        </ModalHeader>

                        <Formik<EmailFormValues>
                            initialValues={emailInitialValues}
                            validationSchema={emailSchema}
                            onSubmit={handleShareByEmail}
                        >
                            {({isSubmitting, errors, touched, submitForm}) => (
                                <Form>
                                    <ModalBody>
                                        <Field name="email">
                                            {({field}: any) => (
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    label="Correo electrónico"
                                                    placeholder="ejemplo@dominio.com"
                                                    variant="bordered"
                                                    labelPlacement="outside"
                                                    isRequired
                                                    isInvalid={!!(touched.email && errors.email)}
                                                    errorMessage={touched.email && errors.email}
                                                    startContent={
                                                        <Mail className="w-4 h-4 text-default-400"/>
                                                    }
                                                />
                                            )}
                                        </Field>

                                        {shareStatus && (
                                            <div
                                                className={`p-3 rounded-medium ${
                                                    shareStatus.success
                                                        ? 'bg-success/10 border border-success text-success'
                                                        : 'bg-danger/10 border border-danger text-danger'
                                                }`}
                                            >
                                                <p className="text-sm font-medium">{shareStatus.message}</p>
                                            </div>
                                        )}
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button
                                            variant="flat"
                                            onPress={handleCloseModal}
                                            isDisabled={isSubmitting}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={submitForm}
                                            isLoading={isSubmitting}
                                            isDisabled={isSubmitting}
                                            startContent={!isSubmitting && <Send className="w-4 h-4"/>}
                                        >
                                            Enviar
                                        </Button>
                                    </ModalFooter>
                                </Form>
                            )}
                        </Formik>
                    </ModalContent>
                </Modal>
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
                                variant="bordered"
                                labelPlacement="outside"
                                placeholder="Escribe el título del mensaje"
                                isInvalid={!!(touched.title && errors.title)}
                                errorMessage={touched.title && errors.title}
                            />
                        )}
                    </Field>

                    <Field name="content">
                        {({field, form}: any) => (
                            <Textarea
                                {...field}
                                isClearable
                                onClear={() => form.setFieldValue('content', '')}
                                isRequired
                                label="Mensaje"
                                placeholder="Escribe tu mensaje secreto..."
                                variant="bordered"
                                labelPlacement="outside"
                                minRows={4}
                                isInvalid={!!(errors.content && touched.content)}
                                errorMessage={
                                    errors.content && touched.content ? errors.content : ""
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
                                variant="bordered"
                                labelPlacement="outside"
                                isInvalid={!!(errors.password && touched.password)}
                                errorMessage={
                                    errors.password && touched.password ? errors.password : ""
                                }
                                endContent={
                                    <button
                                        aria-label="toggle password visibility"
                                        className="focus:outline-none cursor-pointer"
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <EyeOff className="w-5 h-5 text-default-400 pointer-events-none"/>
                                        ) : (
                                            <Eye className="w-5 h-5 text-default-400 pointer-events-none"/>
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