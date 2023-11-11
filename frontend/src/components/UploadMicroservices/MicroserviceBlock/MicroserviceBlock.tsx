import axios from 'axios';
import S from './styles'
import { useFormData } from 'components/MultiStepForm/Form/FormProvider';
import { useEffect } from 'react';
import { useAppData } from 'helper/AppProvider';

export default function MicroserviceBlock({ name }) {
    const { microserviceData, setMicroserviceData } = useFormData();
    const { setAppFiles } = useAppData();
    const addMicroservice = (e) => {
        e.preventDefault();
        axios.post(`http://localhost:8000/microservice/add/${name}`).then(res => { setAppFiles(prev => [...prev, name]); setMicroserviceData(JSON.parse(res.data)) })
    };

    useEffect(() => {
        console.log('NEW UPADATE', microserviceData)
    }, [microserviceData])

    return (
        <S.Container>
            {name}
            <S.Add onClick={addMicroservice}>+ Add</S.Add>
        </S.Container>);
}
