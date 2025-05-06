import {useEffect, useState} from "react";
import "./style.css"

type TFile = 'text' | 'arrayBuffer' | 'dataURL';
type TClb = (data: any) => void;

interface DropFileProps {
    onDrop: TClb;
    type?: TFile;
}

const DropFile = ({onDrop, type = 'text'}: DropFileProps) => {

    const [isAnimate, setIsAnimate] = useState(0);

    useEffect(() => {
        const a = () => {
            setIsAnimate((now) => {
                now--;
                if (now < 0) now = 0;
                return now;
            })
            setTimeout(a, 1000)
        }
        a();

    }, []);

    const onStopEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const uploadFile = (file) => {
        let reader = new FileReader(); // Создаем новый экземпляр FileReader

        reader.onload = (e) => {
            let text = e.target.result; // Получаем текст файла
            onDrop(text)
        };

        switch (type) {
            case "arrayBuffer":
                reader.readAsArrayBuffer(file);
                break;
            case "dataURL":
                reader.readAsDataURL(file);
                break;
            case "text":
                reader.readAsText(file);
                break;
        }

    }


    return <div style={{width: '100%', height: '100%'}}
                onDragOver={(e) => {
                    onStopEvent(e);
                    setIsAnimate(2);
                }}
                onDrop={(e) => {
                    setIsAnimate(0);
                    let dt = e.dataTransfer;
                    let files = dt.files;
                    ([...files]).forEach(uploadFile);
                    onStopEvent(e);
                }}
    >
        <svg width="100%" height="100%">
            <rect width="100%" height="100%" stroke="black" opacity=".25" strokeWidth="2" fill="none"
                  className={isAnimate ? "animated-dash" : ''}/>
        </svg>
    </div>
}

export default DropFile;