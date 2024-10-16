<template>
    <div class="markdown-it-container">
        <div
            ref="markdownBodyRef"
            class="markdown-body"
            @click="handleClick($event)"
            v-html="result"
        />
        <div v-if="typing" class="markdown-typing" :style="cursorPosition"/>
    </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
// import 'highlight.js/styles/atom-one-dark.css'
// import './github-markdown.css'
// @ts-ignore
import markdownItMath from '@iktakahiro/markdown-it-katex'
import type {CodePluginOptions} from './codePlugin'
import {codePlugin} from './codePlugin'
import {customLinkPlugin} from './customLink'
import {aPlugin} from './aPlugin'

interface Options extends Partial<MarkdownIt.Options> {
    lineNumbers?: boolean
}

const props = withDefaults(
    defineProps<{
        content: string
        html?: boolean
        breaks?: boolean
        linkify?: boolean
        typographer?: boolean
        // 是否显示代码行
        lineNumbers?: boolean
        // 是否显示打字效果
        typing: boolean
    }>(),
    {
        content: '',
        html: true,
        breaks: true,
        typographer: true,
        linkify: true,
        lineNumbers: true,
        typing: false
    }
)
const emit = defineEmits<{
    (event: 'click-custom-link', value: string): void
}>()
const result = ref('')
const markdownBodyRef = shallowRef<HTMLDivElement>()
const createMarkdown = (options: Options) => {
    const md = new MarkdownIt({
        ...options,
        langPrefix: 'language-',
        highlight(str: any, lang: any) {
            try {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(lang, str, true).value
                }
                return hljs.highlightAuto(str).value
            } catch (error) {
                return str
            }
        }
    })
    md.use<CodePluginOptions>(codePlugin, {
        lineNumbers: options.lineNumbers
    })
    md.use(markdownItMath, {
        output: 'mathml'
    })
    md.use(aPlugin)
    md.use(customLinkPlugin)

    return md
}
let md: MarkdownIt

const findLastTextNode = (parent: Node): Node | undefined => {
    const children = parent.childNodes
    for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i]
        if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue!)) {
            node.nodeValue?.replace(/\S+$/, '')
            return node
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const lastNode = findLastTextNode(node)
            if (lastNode) {
                return lastNode
            }
        }
    }
}
const cursorPosition = reactive({
    top: 'auto',
    left: 'auto'
})
const updateCursor = () => {
    if (markdownBodyRef.value) {
        const lastTextNode = findLastTextNode(markdownBodyRef.value)
        const textNode = document.createTextNode('\u200B')
        if (lastTextNode) {
            lastTextNode.parentElement?.appendChild(textNode)
        } else {
            markdownBodyRef.value?.appendChild(textNode)
        }
        const range = document.createRange()
        range.setStart(textNode, 0)
        range.setEnd(textNode, 0)
        const textRect = range.getBoundingClientRect()
        const markdownBodyRect = markdownBodyRef.value?.getBoundingClientRect()
        cursorPosition.left = `${textRect.left - markdownBodyRect.left}px`
        cursorPosition.top = `${textRect.top - markdownBodyRect.top}px`
        textNode.remove()
    }
}

const preprocessContent = (content: string) => {
    return content.replace(/\n(#.*#)/g, '\n\n$1')
}

watchEffect(() => {
    md = createMarkdown({
        html: props.html,
        breaks: props.breaks,
        typographer: props.typographer,
        linkify: props.linkify,
        lineNumbers: props.lineNumbers
    })
    result.value = md.render(preprocessContent(props.content))
})

watch(
    () => props.content,
    async (value) => {
        result.value = md?.render(preprocessContent(value))
        await nextTick()
        updateCursor()
    },
    {
        immediate: true
    }
)
const handleClick = async (e: any) => {
    console.log(e.target)
    const target: HTMLElement = e.target
    if (target.className === 'code-copy-btn') {
        const text = e.target.parentElement.nextElementSibling.textContent
        // copy text to clipboard
        await navigator.clipboard.writeText(text)
    }
    if (target.className === 'markdown-custom-link') {
        emit('click-custom-link', target.textContent!)
    }
}

</script>

<style lang="scss">
@use 'markdown.scss';
</style>
