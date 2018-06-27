/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode";
import { ANTLRErrorListener } from '../../node_modules/antlr4ts/ANTLRErrorListener';
import { Recognizer } from '../../node_modules/antlr4ts/Recognizer';
import { RecognitionException } from '../../node_modules/antlr4ts/RecognitionException';
import { Token } from '../../node_modules/antlr4ts/Token';
import { errorDescription } from './MongoCommand';

export class ParserErrorListener implements ANTLRErrorListener<Token> {
    private _errors: errorDescription[] = [];

    public get errors(): errorDescription[] {
        return this._errors;
    }

    public syntaxError(
        // tslint:disable-next-line:no-any
        _recognizer: Recognizer<Token, any>,
        offendingSymbol: Token | undefined,
        line: number,
        charPositionInLine: number,
        _msg: string,
        e: RecognitionException | undefined): void {

        const position = new vscode.Position(line - 1, charPositionInLine); // Symbol lines are 1-indexed. Position lines are 0-indexed
        const text = offendingSymbol.text; // Temporary just use the symbol text for the message, to make changing tests easier as a separate PR
        let range = new vscode.Range(position, position);

        let error: errorDescription = {
            message: text,
            range: range,
            exception: e
        };
        this._errors.push(error);
    }
}

export class LexerErrorListener implements ANTLRErrorListener<number> {
    private _errors: errorDescription[] = [];

    public get errors(): errorDescription[] {
        return this._errors;
    }

    public syntaxError(
        // tslint:disable-next-line:no-any
        _recognizer: Recognizer<number, any>,
        _offendingSymbol: number | undefined,
        line: number,
        charPositionInLine: number,
        msg: string,
        e: RecognitionException | undefined): void {

        const position = new vscode.Position(line - 1, charPositionInLine); // Symbol lines are 1-indexed. Position lines are 0-indexed
        let range = new vscode.Range(position, position);

        let error: errorDescription = {
            message: msg,
            range: range,
            exception: e
        };
        this._errors.push(error);
    }
}
