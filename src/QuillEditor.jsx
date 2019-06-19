import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

export default class QuillEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: '' } // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this);
        this.quillRef = null;      // Quill instance
        this.reactQuillRef = null; // ReactQuill component
        this.imageHandler = this.imageHandler.bind(this);
        this.saveToServer = this.saveToServer.bind(this);
        this.modules = {
            toolbar: {
                container: [
                    [{ font: [] }, { size: [] }],
                    [{ align: [] }, 'direction'],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ color: [] }, { background: [] }],
                    [{ script: 'super' }, { script: 'sub' }],
                    ['blockquote', 'code-block'],
                    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                handlers: {
                    'image': this.imageHandler
                }
            },
        };
    }

    handleChange(value) {
        this.setState({ text: value })
    }

    componentDidMount() {
        this.attachQuillRefs()
    }

    componentDidUpdate() {
        this.attachQuillRefs()
    }

    attachQuillRefs = () => {
        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        this.quillRef = this.reactQuillRef.getEditor();
    }

    insertText = () => {
        console.log('insert');
        // var range = this.quillRef.getSelection();
        // let position = range ? range.index : 0;
        // this.quillRef.insertText(position, 'Hello, World! ');
    }

    imageHandler() {
        console.log('handle: ', this);
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = () => {
            var file = input.files[0];
            if (/^image\//.test(file.type)) {
                this.saveToServer(file);
            };
        }
        input.click();
    }

    saveToServer(file) {
        var xhr, formData;
        xhr = new XMLHttpRequest();
        formData = new FormData();
        console.log("Uploading, please wait.");
        formData.append("file", file, file.name);
        formData.append("rewriteName", file.name);
        formData.append("pathFolderSave", '/images/UserFeedback/');
        try {
            xhr.open('POST', 'http://sandbox.resources.anbinhairlines.vn/Image/UploadImage/', true);
            xhr.setRequestHeader("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDg0MDgyNDgsImlzcyI6IkFCQWlyU2VydmljZSIsImF1ZCI6IkFCQWlyU2VydmljZSJ9.bgDWDflTdU8EZ1TJQrrTlEFjBYvpEvWa1081VUsOU_8');
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        console.log(xhr.response);
                        var range = this.quillRef.getSelection();
                        let position = range ? range.index : 0;
                        var value = xhr.response;
                        this.quillRef.insertEmbed(position, 'image', value);
                    } else {
                        console.log('upload error', xhr.response);
                    }
                }
            };
            xhr.send(formData);
        } catch (e) {
            xhr.abort();
        }
    }



    render() {
        return (
            <div>
                <ReactQuill value={this.state.text}
                    onChange={this.handleChange} theme="snow"
                    modules={this.modules} formats={this.formats}
                    ref={(el) => { this.reactQuillRef = el }} />
            </div>
        )
    }
}

