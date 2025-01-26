import { notifications } from '@mantine/notifications';
import ErrorIcon from '@mui/icons-material/Error';

function showErrorNotification(customMessage, timeOut = 3000) {
    notifications.show({
        autoClose: timeOut,
        color: "red",
        title: 'Error!',
        message: customMessage,
    })
}

export default showErrorNotification;