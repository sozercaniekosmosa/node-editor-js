import Modal from "./ModalWindow.tsx";
import ButtonEx from "./ButtonEx.tsx";

interface DialogProps {
    onKeyDown?: ({key}: { key: any }) => void
}

const Dialog = ({
                    show,
                    setShow,
                    title = 'Заголовок',
                    message = 'Сообщение',
                    onConfirm = null,
                    children = null,
                    onClose = null,
                    confirmName = 'Да',
                    props = {},
                }) => {
    // const [show, setShow] = useState(true);

    const handleClose = () => {
        setShow(false);
        onClose && onClose()
    };

    return (<>
        <Modal show={!!show} onHide={handleClose} {...props}>
            <Modal.Header closeButton>
                <Modal.Title className="h6">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">{children ? children : message}</Modal.Body>
            {onConfirm && <Modal.Footer className="gap-1">
                <ButtonEx onAction={handleClose}>Отмена</ButtonEx>
                <ButtonEx onAction={() => setShow(false) || onConfirm()}
                          autoFocus={true} className="bg-lime-900">{confirmName}</ButtonEx>
            </Modal.Footer>}
        </Modal>
    </>);
}

export default Dialog;