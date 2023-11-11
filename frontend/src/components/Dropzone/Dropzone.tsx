import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";

import File from "assets/upload_file.svg";

import S from "./style";
import axios from "axios";
import { useFormData } from "components/MultiStepForm/Form/FormProvider";
import { useAppData } from "helper/AppProvider";


export default function Dropzone({ filetype, type }) {
  const { appFiles } = useAppData()
  const [files, setFiles] = useState<File[]>(appFiles);
  const [rejectedfiles, setRejectedFiles] = useState<FileRejection[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles?.length) {
        setFiles((previousFiles) => [...previousFiles, ...acceptedFiles]);

      }

      if (fileRejections?.length) {
        setRejectedFiles((previousFiles) => [
          ...previousFiles,
          ...fileRejections,
        ]);
      }
    },
    [],
  );

  let acceptedMime = {}

  acceptedMime = (filetype === "python") ? {
    "text/x-python": [".py"]
  } : {
    "text/csv": [".csv"]
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedMime,
    onDrop,
  });

  const { setMicroserviceData } = useFormData()


  const mapFiles = type === 'upload' ? files.concat(appFiles) : files;
  console.log('PRE', mapFiles)
  const fileDisplay = mapFiles?.map((file) => {
    console.log('FILE', file)
    return (<S.FileBox key={window.crypto.randomUUID()}>
      <S.FileIcon
        style={{ width: "12%", marginRight: "5px", marginTop: "-10px" }}
        src={File}
      />
      <p>
        {typeof file === 'string' ?
          (
            <>
              <strong>{file}</strong>
              <br />
              <span style={{ color: "#aaa" }}>Added previously</span>
            </>
          ) :
          (
            <>
              <strong>{file.name}</strong>
              <br />
              <span style={{ color: "#aaa" }}>{file.size} bytes</span>
            </>)
        }

      </p>
    </S.FileBox>)
  });


  const { setAppFiles } = useAppData();

  useEffect(() => {
    return () => {
      if (files) {
        if (filetype == "python") {
          console.log('SETTING')
          setAppFiles(prev => [...prev, ...files]);
        } else {
          files?.map((file) => {
            const reader = new FileReader();
            reader.readAsText(file)
            reader.onload = () => {
              const base64data = reader.result;

              if (base64data) {
                axios.post('http://localhost:8000/upload_csv', { 'filename': file.name, 'content': base64data })
              }
            };
          })
        }
      }
    }
  }, [files])

  useEffect(() => {
    console.log('Reset')
    setAppFiles([]);
  }, [])


  return (
    <>
      <S.Container
        style={{ background: isDragActive ? "#ededed" : "#FFE3E3" }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <S.Wrapper>
          <S.FileIcon src={File} />
          <h6>
            Drag & Drop or{" "}
            <div
              style={{
                cursor: "pointer",
                color: "#5f7cce",
                textAlign: "center",
              }}
            >
              <strong>browse</strong>
            </div>
          </h6>
        </S.Wrapper>
      </S.Container>
      <aside style={{ width: "500px" }}>
        {fileDisplay.length > 0 ? (
          <S.ScrollableDiv style={{ maxHeight: type === 'upload' ? '320px' : '120px' }}>{fileDisplay}</S.ScrollableDiv>
        ) : null}

        {rejectedfiles &&
          rejectedfiles.map((file) =>
            file.errors.map((error) => (
              <ul>
                {error.code} {error.message}
              </ul>
            )),
          )}
      </aside>
    </>
  );
}
