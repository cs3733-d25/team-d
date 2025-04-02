import React from 'react';
import ExampleComponent from '../components/ExampleComponent.tsx';
import '../styles/styles.css';

const ExamplePage = () => {
    return (
        <div className="p-10">
            <h1 className="font-bold text-xl pb-4">Example Page</h1>
            <p>Psst, did you know it's April Fools Today????</p>
            <p>NO?!</p>
            <ExampleComponent></ExampleComponent>
        </div>
    );
};

export default ExamplePage;
