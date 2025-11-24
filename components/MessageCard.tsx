'use client';

import {Component} from "react";
import {Card, CardBody, CardFooter, CardHeader} from "@heroui/card";
import {Mail, ShieldCheck, Shredder} from "lucide-react";
import {Divider} from "@heroui/divider";

export class MessageCard extends Component<{ message: { title: string; content: string } }> {
    render() {
        return <Card className="max-w-md">
            <CardHeader className="flex gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-success/10">
                    <ShieldCheck className="w-6 h-6 text-success"/>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{this.props.message.title}</p>
                </div>
            </CardHeader>

            <Divider/>

            <CardBody className="py-6 flex gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-400/10">
                    <Mail className="w-5 h-5 text-default-400 flex-shrink-0 mt-1"></Mail>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg whitespace-pre-wrap">{this.props.message.content}</p>
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

        </Card>;
    }
}