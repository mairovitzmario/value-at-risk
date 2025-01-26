import { notifications } from '@mantine/notifications';
import ErrorIcon from '@mui/icons-material/Error';

function showErrorNotification(customMessage) {
    notifications.show({
        autoClose: 3000,
        color: "red",
        title: 'Error!',
        message: customMessage,
    })
}

export default showErrorNotification;