import {messageRepository} from "@/repository/repository";
import PasswordForm from "./PasswordForm";
import {Card, CardBody, CardHeader} from "@heroui/card";
import {Lock, Shredder} from "lucide-react";
import {Divider} from "@heroui/divider";
import {MessageCard} from "@/components/MessageCard";

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
        <MessageCard message={msg}/>
    );
}