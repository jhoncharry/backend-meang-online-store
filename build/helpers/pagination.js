"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagination = void 0;
function pagination(page = 1, itemsPage = 20, model, filters = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (itemsPage < 1 || itemsPage > 20)
            itemsPage = 20;
        if (page < 1)
            page = 1;
        const total = yield model.countDocuments(filters);
        const pages = Math.ceil(total / itemsPage);
        return {
            page,
            skip: (page - 1) * itemsPage,
            pages,
            itemsPage,
            total,
        };
    });
}
exports.pagination = pagination;
