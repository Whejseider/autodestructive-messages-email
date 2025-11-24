import {messageRepository} from "@/repository/repository";
import PasswordForm from "./PasswordForm";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {ShieldCheck, Lock, Shredder, Mail} from "lucide-react";
import {Divider} from "@heroui/divider";

export default async function MessageView({id}: { id: string }) {
    const msg = await messageRepository.getById(id);

    if (!msg) {
        return (
            <Card className="max-w-md border-danger">
                <CardBody className="text-center py-8">
                    <Shredder className="w-16 h-16 mx-auto mb-4 text-danger"/>
                    <h2 className="text-2xl font-bold mb-2 text-danger">¿Buscabas algo?</h2>
                    <p className="text-default-500">
                        Este mensaje ya fue leído y autodestruido, o nunca existió.
                    </p>
                </CardBody>
            </Card>
        );
    }

    if (msg.passwordHash) {
        return (
            <Card className="max-w-md">
                <CardHeader className="flex flex-col items-start gap-2 pb-4">
                    <div className="flex items-center gap-2">
                        <Lock className="w-6 h-6 text-warning"/>
                        <h1 className="text-2xl font-bold">Mensaje Protegido</h1>
                    </div>
                </CardHeader>
                <Divider/>
                <CardBody className="gap-4">
                    <p className="text-default-600">
                        Este mensaje está protegido con contraseña. Ingrésala para poder leerlo.
                    </p>
                    <PasswordForm id={id}/>
                </CardBody>
            </Card>
        );
    }

    await messageRepository.deleteById(id);

    return (
        <Card className="max-w-md">
            <CardHeader className="flex gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <ShieldCheck className="w-6 h-6 text-success"/>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{msg.title}</p>
                </div>
            </CardHeader>

            <Divider/>

            <CardBody className="py-6 flex gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-400/10">
                    <Mail className="w-5 h-5 text-default-400 flex-shrink-0 mt-1"></Mail>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg whitespace-pre-wrap">{msg.content}</p>
                </div>
            </CardBody>

            <Divider/>

            <CardFooter className="bg-danger/5">
                <div className="flex items-center gap-2 text-danger">
                    <Shredder className="w-5 h-5"/>
                    <p className="text-sm font-medium">
                        Este mensaje se ha autodestruido y no puede ser recuperado
                    </p>
                </div>
            </CardFooter>

        </Card>
    );
}